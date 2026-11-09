/*
Test Documentation:
- Test Name: userProfileFactory - getUserCards success
- Purpose: Validates that getUserCards retrieves user cards from API
- Scenario: API returns user cards successfully
- Expected Result: Returns array of user cards
*/
/*
Test Documentation:
- Test Name: userProfileFactory - getUserCards with response data
- Purpose: Validates that getUserCards processes response data correctly
- Scenario: API response contains card data
- Expected Result: Returns processed card data array
*/
/*
Test Documentation:
- Test Name: userProfileFactory - getUserCards fallback on error
- Purpose: Validates that getUserCards returns mock data on API failure
- Scenario: API call fails or returns error
- Expected Result: Returns default mock card data
*/
/*
Test Documentation:
- Test Name: userProfileFactory - getUserCards with userId parameter
- Purpose: Validates that getUserCards sends correct userId in request
- Scenario: getUserCards called with specific userId
- Expected Result: Request includes userId parameter
*/
/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: successful API call, response data processing, error fallback, parameter passing
- Edge cases: API failure, missing response data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('userProfileFactory', function() {
    var userProfileFactory;
    var $httpBackend;
    var API_BASE_URL;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_userProfileFactory_, _$httpBackend_, _API_BASE_URL_, _$rootScope_) {
      userProfileFactory = _userProfileFactory_;
      $httpBackend = _$httpBackend_;
      API_BASE_URL = _API_BASE_URL_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      it('should retrieve user cards from API successfully', function() {
        var userId = 'user123';
        var mockResponse = [
          {cardId: 'card001', userId: 'user123'},
          {cardId: 'card002', userId: 'user123'},
          {cardId: 'card003', userId: 'user123'}
        ];
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, mockResponse);
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card001');
      });

      it('should process response data correctly', function() {
        var userId = 'user456';
        var mockResponse = [
          {cardId: 'card101', userId: 'user456'},
          {cardId: 'card102', userId: 'user456'}
        ];
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, mockResponse);
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card101');
        expect(result[0].userId).toBe('user456');
        expect(result[1].cardId).toBe('card102');
      });

      it('should return mock data when API call fails', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(500, 'Internal Server Error');
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card001');
        expect(result[0].userId).toBe('user123');
      });

      it('should return mock data when response data is null', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, null);
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
      });

      it('should send correct userId parameter in request', function() {
        var userId = 'testUser789';
        var mockResponse = [
          {cardId: 'card999', userId: 'testUser789'}
        ];
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, mockResponse);
        
        userProfileFactory.getUserCards({userId: userId});
        
        $httpBackend.flush();
      });

      it('should handle network timeout error', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(0, '');
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('edge cases', function() {
      it('should handle empty response array', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, []);
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle malformed response', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, 'invalid json');
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
      });

      it('should handle 404 Not Found error', function() {
        var userId = 'nonexistent';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(404, 'Not Found');
        
        var result;
        userProfileFactory.getUserCards({userId: userId}).$promise.then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
      });
    });

    describe('resource configuration', function() {
      it('should be a valid $resource instance', function() {
        expect(userProfileFactory).toBeDefined();
        expect(typeof userProfileFactory.getUserCards).toBe('function');
      });

      it('should return object with $promise property', function() {
        var userId = 'user123';
        
        $httpBackend.expectGET(API_BASE_URL + '/users/' + userId + '/cards')
          .respond(200, []);
        
        var resource = userProfileFactory.getUserCards({userId: userId});
        
        expect(resource.$promise).toBeDefined();
        expect(typeof resource.$promise.then).toBe('function');
        
        $httpBackend.flush();
      });
    });
  });
})();