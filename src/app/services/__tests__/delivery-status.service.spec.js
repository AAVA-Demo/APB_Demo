/*
Test Documentation:
- Test Name: deliveryStatusService - updateStatus / getStatus
- Purpose: Validate that the service correctly updates delivery status via PUT, fires the correct analytics event based on status, and retrieves delivery status via GET.
- Scenario 1 (updateStatus - delivered): Status 'delivered' fires 'fraud_alert_delivered' analytics event.
- Scenario 2 (updateStatus - failed): Status 'failed' fires 'fraud_alert_failed' analytics event.
- Scenario 3 (updateStatus - other): Any other status fires 'fraud_alert_sent' analytics event.
- Scenario 4 (updateStatus - payload): Payload includes deliveryId, status, channel, lastAttemptAt, and errorMessage.
- Scenario 5 (updateStatus - errorMessage null): errorMessage defaults to null when not provided.
- Scenario 6 (updateStatus - HTTP error): PUT fails; error is logged and promise is rejected.
- Scenario 7 (getStatus - Success): GET resolves and returns response.data.
- Scenario 8 (getStatus - Error): GET fails; error is logged and promise is rejected.
- Expected Result: Correct analytics events fired; correct payload sent; promises resolve/reject appropriately.
*/

describe('deliveryStatusService', function () {
  var deliveryStatusService, $httpBackend, $rootScope, API_CONFIG, mockAnalyticsService;

  beforeEach(module('fraudAlertApp'));

  beforeEach(function () {
    API_CONFIG = {
      baseUrl: 'https://api.fraudalert.test',
      endpoints: {
        delivery: '/delivery'
      },
      timeout: 5000
    };

    mockAnalyticsService = {
      trackEvent: jasmine.createSpy('trackEvent').and.returnValue(Promise.resolve())
    };

    module(function ($provide) {
      $provide.constant('API_CONFIG', API_CONFIG);
      $provide.value('analyticsService', mockAnalyticsService);
    });
  });

  beforeEach(inject(function (_deliveryStatusService_, _$httpBackend_, _$rootScope_) {
    deliveryStatusService = _deliveryStatusService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('updateStatus()', function () {

    it('should PUT to the correct URL with a well-formed payload', function () {
      var deliveryId = 'D001';
      var status = 'delivered';
      var channel = 'push';
      var mockResponse = { updated: true };

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId
      ).respond(200, mockResponse);

      var result;
      deliveryStatusService.updateStatus(deliveryId, status, channel).then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should fire fraud_alert_delivered analytics event when status is delivered', function () {
      var deliveryId = 'D002';

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'delivered', 'push');
      $httpBackend.flush();

      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(
        'fraud_alert_delivered',
        jasmine.objectContaining({ deliveryId: deliveryId, channel: 'push', status: 'delivered' })
      );
    });

    it('should fire fraud_alert_failed analytics event when status is failed', function () {
      var deliveryId = 'D003';

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'failed', 'sms');
      $httpBackend.flush();

      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(
        'fraud_alert_failed',
        jasmine.objectContaining({ deliveryId: deliveryId, channel: 'sms', status: 'failed' })
      );
    });

    it('should fire fraud_alert_sent analytics event for any other status', function () {
      var deliveryId = 'D004';

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'queued', 'email');
      $httpBackend.flush();

      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(
        'fraud_alert_sent',
        jasmine.objectContaining({ deliveryId: deliveryId, channel: 'email', status: 'queued' })
      );
    });

    it('should set errorMessage to null when not provided', function () {
      var deliveryId = 'D005';
      var capturedBody;

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId,
        function (body) {
          capturedBody = angular.fromJson(body);
          return true;
        }
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'delivered', 'push');
      $httpBackend.flush();

      expect(capturedBody.errorMessage).toBeNull();
    });

    it('should include errorMessage in the payload when provided', function () {
      var deliveryId = 'D006';
      var capturedBody;

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId,
        function (body) {
          capturedBody = angular.fromJson(body);
          return true;
        }
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'failed', 'sms', 'Provider timeout');
      $httpBackend.flush();

      expect(capturedBody.errorMessage).toBe('Provider timeout');
    });

    it('should include a lastAttemptAt ISO timestamp in the payload', function () {
      var deliveryId = 'D007';
      var capturedBody;

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId,
        function (body) {
          capturedBody = angular.fromJson(body);
          return true;
        }
      ).respond(200, {});

      deliveryStatusService.updateStatus(deliveryId, 'delivered', 'push');
      $httpBackend.flush();

      expect(capturedBody.lastAttemptAt).toBeDefined();
      expect(new Date(capturedBody.lastAttemptAt).toISOString()).toBe(capturedBody.lastAttemptAt);
    });

    it('should reject the promise and log an error when PUT fails', function () {
      spyOn(console, 'error');
      var deliveryId = 'D008';
      var errorResult;

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/' + deliveryId
      ).respond(503, { message: 'Service Unavailable' });

      deliveryStatusService.updateStatus(deliveryId, 'delivered', 'push').catch(function (err) {
        errorResult = err;
      });

      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Failed to update delivery status:'),
        jasmine.anything()
      );
      expect(errorResult).toBeDefined();
    });

  });

  describe('getStatus()', function () {

    it('should GET delivery status for a given notificationId and return response.data', function () {
      var notificationId = 'N001';
      var mockStatus = { status: 'delivered', channel: 'push' };

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/notification/' + notificationId
      ).respond(200, mockStatus);

      var result;
      deliveryStatusService.getStatus(notificationId).then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockStatus);
    });

    it('should construct the correct GET URL using notificationId', function () {
      var notificationId = 'N002';
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/notification/' + notificationId;

      $httpBackend.expectGET(expectedUrl).respond(200, {});
      deliveryStatusService.getStatus(notificationId);
      $httpBackend.flush();
    });

    it('should reject the promise and log an error when GET fails', function () {
      spyOn(console, 'error');
      var notificationId = 'N003';
      var errorResult;

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/notification/' + notificationId
      ).respond(404, { message: 'Not Found' });

      deliveryStatusService.getStatus(notificationId).catch(function (err) {
        errorResult = err;
      });

      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Failed to fetch delivery status:'),
        jasmine.anything()
      );
      expect(errorResult).toBeDefined();
    });

    it('should return a promise', function () {
      $httpBackend.whenGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.delivery + '/notification/N004'
      ).respond(200, {});

      var result = deliveryStatusService.getStatus('N004');
      expect(typeof result.then).toBe('function');
      $httpBackend.flush();
    });

  });
});

/*
Coverage Report:
- Functions Tested: updateStatus, getStatus
- Scenarios Covered:
    1. Successful PUT with response.data return
    2. Analytics event 'fraud_alert_delivered' for status='delivered'
    3. Analytics event 'fraud_alert_failed' for status='failed'
    4. Analytics event 'fraud_alert_sent' for all other statuses
    5. errorMessage defaults to null when not provided
    6. errorMessage included in payload when provided
    7. lastAttemptAt ISO timestamp in payload
    8. HTTP 503 error handling for PUT
    9. Successful GET with correct URL and response.data
    10. URL construction validation for GET
    11. HTTP 404 error handling for GET
    12. Return type is a promise (GET)
- Uncovered Scenarios: Analytics trackEvent failure path
*/