/*
Test Documentation:
- Test Name: UserProfileService - getCardsByUser - success scenario
- Purpose: Validates that getCardsByUser retrieves user's cards successfully
- Scenario: Service calls API with valid userId
- Expected Result: Returns array of cards owned by user
*/
/*
Test Documentation:
- Test Name: UserProfileService - getCardsByUser - error scenario
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: UserProfileService - getCardsByUser - empty result
- Purpose: Validates handling when user has no cards
- Scenario: API returns empty array
- Expected Result: Returns empty array successfully
*/
/*
Test Documentation:
- Test Name: UserProfileService - getCardsByUser - null userId
- Purpose: Validates handling of null/undefined userId
- Scenario: Service called with null userId
- Expected Result: API call is made with null parameter
*/
/*
Coverage Report:
- Functions tested: getCardsByUser
- Scenarios covered: success responses, error handling, empty results, null parameters, HTTP error codes (404, 500, 401)
- Uncovered scenarios: network timeout, concurrent requests (require additional infrastructure)
*/

describe('UserProfileService', function() {
  'use strict';

  var UserProfileService;
  var $httpBackend;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _$q_, _$rootScope_) {
    UserProfileService = _UserProfileService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardsByUser', function() {
    it('should retrieve all cards for a given userId successfully', function() {
      var userId = 'user123';
      var mockResponse = [
        {
          cardId: 'card1',
          cardName: 'Visa Gold',
          cardNumber: '**** **** **** 1234',
          cardType: 'Credit',
          creditLimit: 5000,
          userId: 'user123'
        },
        {
          cardId: 'card2',
          cardName: 'MasterCard Platinum',
          cardNumber: '**** **** **** 5678',
          cardType: 'Credit',
          creditLimit: 10000,
          userId: 'user123'
        }
      ];

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardId).toBe('card2');
    });

    it('should return empty array when user has no cards', function() {
      var userId = 'user456';
      var mockResponse = [];

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var userId = 'user789';
      var errorResponse = { message: 'Internal Server Error' };

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(500, errorResponse);

      var error;
      UserProfileService.getCardsByUser(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
      expect(error.data).toEqual(errorResponse);
    });

    it('should handle 404 error when user not found', function() {
      var userId = 'nonexistent';
      var errorResponse = { message: 'User not found' };

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(404, errorResponse);

      var error;
      UserProfileService.getCardsByUser(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
      expect(error.data.message).toBe('User not found');
    });

    it('should handle 401 unauthorized error', function() {
      var userId = 'user999';
      var errorResponse = { message: 'Unauthorized access' };

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(401, errorResponse);

      var error;
      UserProfileService.getCardsByUser(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
      expect(error.data.message).toBe('Unauthorized access');
    });

    it('should handle 403 forbidden error', function() {
      var userId = 'user888';
      var errorResponse = { message: 'Access forbidden' };

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(403, errorResponse);

      var error;
      UserProfileService.getCardsByUser(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(403);
      expect(error.data.message).toBe('Access forbidden');
    });

    it('should handle null userId parameter', function() {
      var userId = null;
      var mockResponse = [];

      $httpBackend.expectGET('/api/users/null/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should handle undefined userId parameter', function() {
      var userId = undefined;
      var mockResponse = [];

      $httpBackend.expectGET('/api/users/undefined/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should handle empty string userId', function() {
      var userId = '';
      var errorResponse = { message: 'Invalid user ID' };

      $httpBackend.expectGET('/api/users//cards')
        .respond(400, errorResponse);

      var error;
      UserProfileService.getCardsByUser(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    it('should handle special characters in userId', function() {
      var userId = 'user@123#';
      var mockResponse = [
        { cardId: 'card1', userId: 'user@123#' }
      ];

      $httpBackend.expectGET('/api/users/' + encodeURIComponent(userId) + '/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result[0].userId).toBe('user@123#');
    });

    it('should handle large number of cards', function() {
      var userId = 'user123';
      var mockResponse = [];
      for (var i = 1; i <= 20; i++) {
        mockResponse.push({
          cardId: 'card' + i,
          cardName: 'Card ' + i,
          userId: userId
        });
      }

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(20);
    });

    it('should handle response with partial card data', function() {
      var userId = 'user123';
      var mockResponse = [
        {
          cardId: 'card1',
          cardName: 'Visa Gold'
        }
      ];

      $httpBackend.expectGET('/api/users/' + userId + '/cards')
        .respond(200, mockResponse);

      var result;
      UserProfileService.getCardsByUser(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardName).toBe('Visa Gold');
      expect(result[0].creditLimit).toBeUndefined();
    });
  });

  describe('Service initialization', function() {
    it('should be defined', function() {
      expect(UserProfileService).toBeDefined();
    });

    it('should have getCardsByUser method', function() {
      expect(UserProfileService.getCardsByUser).toBeDefined();
      expect(typeof UserProfileService.getCardsByUser).toBe('function');
    });

    it('should return a service object with correct structure', function() {
      expect(UserProfileService).toEqual(jasmine.objectContaining({
        getCardsByUser: jasmine.any(Function)
      }));
    });
  });
});