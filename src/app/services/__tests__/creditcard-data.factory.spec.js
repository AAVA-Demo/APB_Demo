/*
Test Documentation:
- Test Name: CreditCardDataFactory Unit Tests
- Purpose: Validate getCardData method for retrieving credit card information
- Scenario: Successful API retrieval, error handling, proper HTTP configuration
- Expected Result: Resolved promise with card data, proper error propagation on API failure
*/

describe('CreditCardDataFactory', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var CreditCardDataFactory, $httpBackend, $rootScope;

  beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_, _$rootScope_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $rootScope.apiBaseUrl = 'https://api.creditcard.example.com';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardData', function() {

    it('should retrieve card data successfully', function() {
      var mockCardData = [
        { cardId: 1, cardNumber: '1234567890123456', creditLimit: 5000, balance: 1200 },
        { cardId: 2, cardNumber: '9876543210987654', creditLimit: 10000, balance: 3500 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, mockCardData);

      var result;
      CreditCardDataFactory.getCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardData);
    });

    it('should return promise', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, []);

      var promise = CreditCardDataFactory.getCardData();

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    it('should handle API error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(500, 'Server error');

      var error;
      CreditCardDataFactory.getCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(401, 'Unauthorized');

      var error;
      CreditCardDataFactory.getCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(401);
    });

    it('should handle 404 not found error', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(404, 'Not found');

      var error;
      CreditCardDataFactory.getCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(404);
    });

    it('should handle empty card data', function() {
      var mockCardData = [];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, mockCardData);

      var result;
      CreditCardDataFactory.getCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should use correct API endpoint', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, []);

      CreditCardDataFactory.getCardData();

      $httpBackend.flush();
    });

    it('should handle network timeout', function() {
      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(0, '');

      var error;
      CreditCardDataFactory.getCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle single card data', function() {
      var mockCardData = [
        { cardId: 1, cardNumber: '1234567890123456', creditLimit: 5000, balance: 1200 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, mockCardData);

      var result;
      CreditCardDataFactory.getCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe(1);
    });

    it('should handle multiple card data', function() {
      var mockCardData = [
        { cardId: 1, cardNumber: '1111111111111111', creditLimit: 3000, balance: 500 },
        { cardId: 2, cardNumber: '2222222222222222', creditLimit: 7000, balance: 2000 },
        { cardId: 3, cardNumber: '3333333333333333', creditLimit: 15000, balance: 8000 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/creditcards').respond(200, mockCardData);

      var result;
      CreditCardDataFactory.getCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(3);
    });

  });

});

/*
Coverage Report:
- Functions tested: getCardData
- Scenarios covered:
  * Successful card data retrieval
  * Promise return validation
  * 500 server error handling
  * 401 unauthorized error handling
  * 404 not found error handling
  * Empty card data handling
  * Correct API endpoint usage
  * Network timeout handling
  * Single card data handling
  * Multiple card data handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/