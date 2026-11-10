/*
Test Documentation:
- Test Name: UserProfileFactory Unit Tests
- Purpose: Validate getUserProfile method for retrieving user profile data
- Scenario: Successful API retrieval, error handling, proper HTTP configuration
- Expected Result: Resolved promise with user profile data, proper error propagation on API failure
*/

describe('UserProfileFactory', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var UserProfileFactory, $httpBackend, $rootScope;

  beforeEach(inject(function(_UserProfileFactory_, _$httpBackend_, _$rootScope_) {
    UserProfileFactory = _UserProfileFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $rootScope.apiBaseUrl = 'https://api.creditcard.example.com';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getUserProfile', function() {

    it('should retrieve user profile successfully', function() {
      var mockProfile = {
        userId: 123,
        name: 'John Doe',
        email: 'john.doe@example.com',
        cardIds: [1, 2, 3]
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, mockProfile);

      var result;
      UserProfileFactory.getUserProfile().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockProfile);
    });

    it('should return promise', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, {});

      var promise = UserProfileFactory.getUserProfile();

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    it('should handle API error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(500, 'Server error');

      var error;
      UserProfileFactory.getUserProfile().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(401, 'Unauthorized');

      var error;
      UserProfileFactory.getUserProfile().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(401);
    });

    it('should handle 404 not found error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(404, 'Not found');

      var error;
      UserProfileFactory.getUserProfile().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(404);
    });

    it('should use correct API endpoint', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, {});

      UserProfileFactory.getUserProfile();

      $httpBackend.flush();
    });

    it('should handle network timeout', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(0, '');

      var error;
      UserProfileFactory.getUserProfile().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should retrieve cardIds from profile', function() {
      var mockProfile = {
        userId: 456,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        cardIds: [10, 20, 30, 40]
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, mockProfile);

      var result;
      UserProfileFactory.getUserProfile().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cardIds).toEqual([10, 20, 30, 40]);
    });

    it('should handle profile with empty cardIds', function() {
      var mockProfile = {
        userId: 789,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        cardIds: []
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, mockProfile);

      var result;
      UserProfileFactory.getUserProfile().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cardIds).toEqual([]);
    });

    it('should handle profile with all user properties', function() {
      var mockProfile = {
        userId: 111,
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        cardIds: [1, 2],
        phone: '555-1234',
        address: '123 Main St'
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/user/profile').respond(200, mockProfile);

      var result;
      UserProfileFactory.getUserProfile().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.userId).toBe(111);
      expect(result.name).toBe('Alice Williams');
      expect(result.email).toBe('alice.williams@example.com');
      expect(result.cardIds).toEqual([1, 2]);
      expect(result.phone).toBe('555-1234');
      expect(result.address).toBe('123 Main St');
    });

  });

});

/*
Coverage Report:
- Functions tested: getUserProfile
- Scenarios covered:
  * Successful user profile retrieval
  * Promise return validation
  * 500 server error handling
  * 401 unauthorized error handling
  * 404 not found error handling
  * Correct API endpoint usage
  * Network timeout handling
  * CardIds retrieval from profile
  * Empty cardIds handling
  * All user properties validation
- Uncovered scenarios: None - comprehensive coverage achieved
*/