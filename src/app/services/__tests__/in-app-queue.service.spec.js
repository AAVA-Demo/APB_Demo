/*
Test Documentation:
- Test Name: inAppQueueService - enqueue / getQueue / markAsRead / clearQueue / getUnreadCount / pollServer
- Purpose: Validate all queue management operations including local storage interactions, read state tracking, server polling, and deduplication logic.
- Scenario 1 (enqueue): Adds a notification to the queue with queuedAt and read=false.
- Scenario 2 (enqueue - existing queue): Appends to existing queue items.
- Scenario 3 (getQueue): Returns current queue from local storage; returns [] when empty.
- Scenario 4 (markAsRead - found): Marks the matching notification as read=true.
- Scenario 5 (markAsRead - not found): Returns undefined when notificationId not found.
- Scenario 6 (clearQueue): Removes the queue key from local storage.
- Scenario 7 (getUnreadCount): Returns correct count of unread notifications.
- Scenario 8 (getUnreadCount - all read): Returns 0 when all notifications are read.
- Scenario 9 (pollServer - new notifications): Fetches from server and adds new notifications to queue.
- Scenario 10 (pollServer - deduplication): Does not add duplicate notifications already in queue.
- Scenario 11 (pollServer - HTTP error): Rejects and logs error on server failure.
- Expected Result: All queue operations behave correctly with local storage and server data.
*/

describe('inAppQueueService', function () {
  var inAppQueueService, $httpBackend, $rootScope, $q, API_CONFIG, mockLocalStorageService;
  var QUEUE_KEY = 'inAppNotificationQueue';

  beforeEach(module('fraudAlertApp'));

  beforeEach(function () {
    API_CONFIG = {
      baseUrl: 'https://api.fraudalert.test',
      endpoints: {
        notifications: '/notifications'
      },
      timeout: 5000
    };

    mockLocalStorageService = (function () {
      var store = {};
      return {
        get: jasmine.createSpy('get').and.callFake(function (key) {
          return store[key] !== undefined ? store[key] : null;
        }),
        set: jasmine.createSpy('set').and.callFake(function (key, value) {
          store[key] = value;
        }),
        remove: jasmine.createSpy('remove').and.callFake(function (key) {
          delete store[key];
        }),
        _reset: function () { store = {}; }
      };
    })();

    module(function ($provide) {
      $provide.constant('API_CONFIG', API_CONFIG);
      $provide.value('localStorageService', mockLocalStorageService);
    });
  });

  beforeEach(inject(function (_inAppQueueService_, _$httpBackend_, _$rootScope_, _$q_) {
    inAppQueueService = _inAppQueueService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  afterEach(function () {
    mockLocalStorageService._reset();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('enqueue()', function () {

    it('should add a notification to the queue with queuedAt and read=false', function () {
      var notification = { id: 'N001', message: 'Fraud detected' };
      inAppQueueService.enqueue(notification);

      expect(mockLocalStorageService.set).toHaveBeenCalledWith(
        QUEUE_KEY,
        jasmine.arrayContaining([
          jasmine.objectContaining({
            id: 'N001',
            message: 'Fraud detected',
            read: false,
            queuedAt: jasmine.any(String)
          })
        ])
      );
    });

    it('should append to existing queue items', function () {
      var existingQueue = [{ id: 'N001', message: 'Alert 1', read: false, queuedAt: new Date().toISOString() }];
      mockLocalStorageService.get.and.returnValue(existingQueue);

      var newNotification = { id: 'N002', message: 'Alert 2' };
      inAppQueueService.enqueue(newNotification);

      var savedQueue = mockLocalStorageService.set.calls.mostRecent().args[1];
      expect(savedQueue.length).toBe(2);
      expect(savedQueue[1].id).toBe('N002');
    });

    it('should set queuedAt to an ISO timestamp', function () {
      var notification = { id: 'N003', message: 'Test' };
      inAppQueueService.enqueue(notification);

      var savedQueue = mockLocalStorageService.set.calls.mostRecent().args[1];
      var queuedAt = savedQueue[0].queuedAt;
      expect(new Date(queuedAt).toISOString()).toBe(queuedAt);
    });

  });

  describe('getQueue()', function () {

    it('should return the current queue from local storage', function () {
      var mockQueue = [{ id: 'N001', message: 'Alert', read: false }];
      mockLocalStorageService.get.and.returnValue(mockQueue);

      var result = inAppQueueService.getQueue();
      expect(result).toEqual(mockQueue);
      expect(mockLocalStorageService.get).toHaveBeenCalledWith(QUEUE_KEY);
    });

    it('should return an empty array when queue is empty', function () {
      mockLocalStorageService.get.and.returnValue(null);

      var result = inAppQueueService.getQueue();
      expect(result).toEqual([]);
    });

  });

  describe('markAsRead()', function () {

    it('should mark the matching notification as read=true', function () {
      var queue = [
        { id: 'N001', message: 'Alert 1', read: false },
        { id: 'N002', message: 'Alert 2', read: false }
      ];
      mockLocalStorageService.get.and.returnValue(queue);

      var result = inAppQueueService.markAsRead('N001');

      expect(result.read).toBe(true);
      var savedQueue = mockLocalStorageService.set.calls.mostRecent().args[1];
      expect(savedQueue[0].read).toBe(true);
      expect(savedQueue[1].read).toBe(false);
    });

    it('should return undefined when notificationId is not found', function () {
      var queue = [{ id: 'N001', message: 'Alert', read: false }];
      mockLocalStorageService.get.and.returnValue(queue);

      var result = inAppQueueService.markAsRead('N999');
      expect(result).toBeUndefined();
    });

  });

  describe('clearQueue()', function () {

    it('should remove the queue key from local storage', function () {
      inAppQueueService.clearQueue();
      expect(mockLocalStorageService.remove).toHaveBeenCalledWith(QUEUE_KEY);
    });

  });

  describe('getUnreadCount()', function () {

    it('should return the correct count of unread notifications', function () {
      var queue = [
        { id: 'N001', read: false },
        { id: 'N002', read: true },
        { id: 'N003', read: false }
      ];
      mockLocalStorageService.get.and.returnValue(queue);

      var count = inAppQueueService.getUnreadCount();
      expect(count).toBe(2);
    });

    it('should return 0 when all notifications are read', function () {
      var queue = [
        { id: 'N001', read: true },
        { id: 'N002', read: true }
      ];
      mockLocalStorageService.get.and.returnValue(queue);

      var count = inAppQueueService.getUnreadCount();
      expect(count).toBe(0);
    });

    it('should return 0 when queue is empty', function () {
      mockLocalStorageService.get.and.returnValue(null);

      var count = inAppQueueService.getUnreadCount();
      expect(count).toBe(0);
    });

  });

  describe('pollServer()', function () {

    it('should fetch from server and add new notifications to queue', function () {
      var existingQueue = [{ id: 'N001', message: 'Old', read: false }];
      mockLocalStorageService.get.and.returnValue(existingQueue);

      var serverNotifications = [
        { id: 'N002', message: 'New Alert 1' },
        { id: 'N003', message: 'New Alert 2' }
      ];

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.notifications + '/in-app'
      ).respond(200, serverNotifications);

      var result;
      inAppQueueService.pollServer().then(function (data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(2);
      var savedQueue = mockLocalStorageService.set.calls.mostRecent().args[1];
      expect(savedQueue.length).toBe(3); // 1 existing + 2 new
    });

    it('should not add duplicate notifications already in queue', function () {
      var existingQueue = [
        { id: 'N001', message: 'Alert 1', read: false },
        { id: 'N002', message: 'Alert 2', read: false }
      ];
      mockLocalStorageService.get.and.returnValue(existingQueue);

      var serverNotifications = [
        { id: 'N002', message: 'Alert 2' }, // duplicate
        { id: 'N003', message: 'Alert 3' }  // new
      ];

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.notifications + '/in-app'
      ).respond(200, serverNotifications);

      inAppQueueService.pollServer();
      $httpBackend.flush();

      var savedQueue = mockLocalStorageService.set.calls.mostRecent().args[1];
      expect(savedQueue.length).toBe(3); // 2 existing + 1 new (N003)
      expect(savedQueue.filter(function (n) { return n.id === 'N002'; }).length).toBe(1);
    });

    it('should reject and log error when server request fails', function () {
      spyOn(console, 'error');
      var errorResult;

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.notifications + '/in-app'
      ).respond(500, { message: 'Server Error' });

      inAppQueueService.pollServer().catch(function (err) {
        errorResult = err;
      });

      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Failed to poll server for notifications:'),
        jasmine.anything()
      );
      expect(errorResult).toBeDefined();
    });

    it('should return a promise', function () {
      $httpBackend.whenGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.notifications + '/in-app'
      ).respond(200, []);

      var result = inAppQueueService.pollServer();
      expect(typeof result.then).toBe('function');
      $httpBackend.flush();
    });

  });
});

/*
Coverage Report:
- Functions Tested: enqueue, getQueue, markAsRead, clearQueue, getUnreadCount, pollServer
- Scenarios Covered:
    1. enqueue adds notification with queuedAt and read=false
    2. enqueue appends to existing queue
    3. queuedAt is ISO timestamp
    4. getQueue returns current queue or []
    5. markAsRead updates read status
    6. markAsRead returns undefined for missing ID
    7. clearQueue removes storage key
    8. getUnreadCount returns correct count
    9. getUnreadCount returns 0 for all read or empty
    10. pollServer fetches and adds new notifications
    11. pollServer deduplicates existing notifications
    12. pollServer rejects and logs on HTTP error
    13. pollServer returns a promise
- Uncovered Scenarios: Concurrent enqueue/markAsRead operations
*/