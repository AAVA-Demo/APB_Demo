/*
Test Documentation:
- Test Name: CardService - getCards success scenario
- Purpose: Validates that getCards successfully retrieves card data for a given user ID
- Scenario: When getCards is called with a valid userId, the service makes an HTTP GET request and resolves with card data
- Expected Result: Promise resolves with the expected card data array
*/
/*
Test Documentation:
- Test Name: CardService - getCards error scenario
- Purpose: Validates that getCards properly handles HTTP errors
- Scenario: When the HTTP request fails, the service logs the error and rejects the promise
- Expected Result: Promise is rejected with the error object and error is logged to console
*/
/*
Test Documentation:
- Test Name: CardService - getCards with empty response
- Purpose: Validates that getCards handles empty data responses correctly
- Scenario: When the API returns an empty array, the service resolves with empty data
- Expected Result: Promise resolves with an empty array
*/
/*
Test Documentation:
- Test Name: CardService - getCards with null userId
- Purpose: Validates behavior when userId is null or undefined
- Scenario: When getCards is called with null/undefined userId, the service still makes the request
- Expected Result: HTTP GET is called with the appropriate endpoint including null/undefined
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: success with data, HTTP error handling, empty response, null/undefined userId
- Edge cases: empty arrays, null values, error responses
- Uncovered scenarios: network timeout (requires additional mocking setup), multiple concurrent calls
*/

describe('CardService', function() {
  'use strict';

  var CardService;
  var $httpBackend;
  var $q;
  var $rootScope;
  var apiBase = '/api';

  // Load the creditCardApp module
  beforeEach(module('creditCardApp'));

  // Inject dependencies
  beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_, _$rootScope_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  // Cleanup after each test
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards', function() {

    it('should successfully retrieve cards for a valid userId', function() {
      // Arrange
      var userId = 'user123';
      var mockCardData = [
        {
          cardId: 'card1',
          cardName: 'Visa Platinum',
          lastFourDigits: '1234',
          cardType: 'Visa',
          creditLimit: 10000,
          availableCredit: 7500,
          outstandingAmount: 2500,
          monthlySpend: 1200
        },
        {
          cardId: 'card2',
          cardName: 'Mastercard Gold',
          lastFourDigits: '5678',
          cardType: 'Mastercard',
          creditLimit: 5000,
          availableCredit: 4000,
          outstandingAmount: 1000,
          monthlySpend: 800
        }
      ];

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, mockCardData);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardName).toBe('Visa Platinum');
      expect(result[1].cardId).toBe('card2');
      expect(result[1].creditLimit).toBe(5000);
    });

    it('should handle HTTP error and reject promise', function() {
      // Arrange
      var userId = 'user123';
      var mockError = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: 'Database connection failed' }
      };

      spyOn(console, 'error');

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(500, mockError.data);

      // Act
      var errorResult;
      CardService.getCards(userId).then(
        function(data) {
          // Should not reach here
        },
        function(error) {
          errorResult = error;
        }
      );

      $httpBackend.flush();

      // Assert
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
      expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
    });

    it('should handle empty card data response', function() {
      // Arrange
      var userId = 'user456';
      var emptyCardData = [];

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, emptyCardData);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle null userId', function() {
      // Arrange
      var userId = null;

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, []);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle undefined userId', function() {
      // Arrange
      var userId = undefined;

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, []);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle 404 Not Found error', function() {
      // Arrange
      var userId = 'nonexistentUser';

      spyOn(console, 'error');

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(404, { message: 'User not found' });

      // Act
      var errorResult;
      CardService.getCards(userId).then(
        function(data) {
          // Should not reach here
        },
        function(error) {
          errorResult = error;
        }
      );

      $httpBackend.flush();

      // Assert
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(404);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 401 Unauthorized error', function() {
      // Arrange
      var userId = 'user123';

      spyOn(console, 'error');

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(401, { message: 'Unauthorized' });

      // Act
      var errorResult;
      CardService.getCards(userId).then(
        function(data) {
          // Should not reach here
        },
        function(error) {
          errorResult = error;
        }
      );

      $httpBackend.flush();

      // Assert
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(401);
      expect(console.error).toHaveBeenCalled();
    });

    it('should return a promise', function() {
      // Arrange
      var userId = 'user123';

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, []);

      // Act
      var promise = CardService.getCards(userId);

      // Assert
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    it('should handle single card response', function() {
      // Arrange
      var userId = 'user789';
      var singleCardData = [
        {
          cardId: 'card1',
          cardName: 'Amex Blue',
          lastFourDigits: '9999',
          cardType: 'American Express',
          creditLimit: 15000,
          availableCredit: 12000,
          outstandingAmount: 3000,
          monthlySpend: 2500
        }
      ];

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, singleCardData);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardName).toBe('Amex Blue');
      expect(result[0].creditLimit).toBe(15000);
    });

    it('should handle large number of cards', function() {
      // Arrange
      var userId = 'user999';
      var largeCardData = [];
      for (var i = 0; i < 50; i++) {
        largeCardData.push({
          cardId: 'card' + i,
          cardName: 'Card ' + i,
          lastFourDigits: String(1000 + i).slice(-4),
          cardType: 'Visa',
          creditLimit: 5000 + (i * 100),
          availableCredit: 3000 + (i * 50),
          outstandingAmount: 2000 + (i * 50),
          monthlySpend: 500 + (i * 10)
        });
      }

      $httpBackend.expectGET(apiBase + '/cards/' + userId)
        .respond(200, largeCardData);

      // Act
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(50);
      expect(result[0].cardId).toBe('card0');
      expect(result[49].cardId).toBe('card49');
    });

  });

});
