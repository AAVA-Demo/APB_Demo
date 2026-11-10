/*
Test Documentation:
- Test Name: CreditCardMasterFactory Unit Tests
- Purpose: Validate getCardDetails method for retrieving detailed credit card information by card IDs
- Scenario: Successful API retrieval with card ID parameters, error handling, empty results
- Expected Result: Resolved promise with card details, proper query parameter formatting, error propagation
*/

describe('CreditCardMasterFactory', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var CreditCardMasterFactory, $httpBackend, $rootScope;

  beforeEach(inject(function(_CreditCardMasterFactory_, _$httpBackend_, _$rootScope_) {
    CreditCardMasterFactory = _CreditCardMasterFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $rootScope.apiBaseUrl = 'https://api.creditcard.example.com';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardDetails', function() {

    it('should retrieve card details for given card IDs', function() {
      var cardIds = [1, 2, 3];
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 },
        { cardId: 2, cardNumber: '9876543210987654', cardType: 'MasterCard', creditLimit: 10000, balance: 3500 },
        { cardId: 3, cardNumber: '1111222233334444', cardType: 'Amex', creditLimit: 8000, balance: 2000 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1%2C2%2C3').respond(200, mockCardDetails);

      var result;
      CreditCardMasterFactory.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardDetails);
    });

    it('should format card IDs as comma-separated query parameter', function() {
      var cardIds = [10, 20];
      var mockCardDetails = [
        { cardId: 10, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=10%2C20').respond(200, mockCardDetails);

      CreditCardMasterFactory.getCardDetails(cardIds);

      $httpBackend.flush();
    });

    it('should handle single card ID', function() {
      var cardIds = [5];
      var mockCardDetails = [
        { cardId: 5, cardNumber: '5555666677778888', cardType: 'Discover', creditLimit: 12000, balance: 4500 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=5').respond(200, mockCardDetails);

      var result;
      CreditCardMasterFactory.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe(5);
    });

    it('should return promise', function() {
      var cardIds = [1];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1').respond(200, []);

      var promise = CreditCardMasterFactory.getCardDetails(cardIds);

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    it('should handle API error', function() {
      var cardIds = [1, 2];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1%2C2').respond(500, 'Server error');

      var error;
      CreditCardMasterFactory.getCardDetails(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 not found error', function() {
      var cardIds = [999];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=999').respond(404, 'Not found');

      var error;
      CreditCardMasterFactory.getCardDetails(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(404);
    });

    it('should handle empty card details response', function() {
      var cardIds = [1, 2];
      var mockCardDetails = [];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1%2C2').respond(200, mockCardDetails);

      var result;
      CreditCardMasterFactory.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should use correct API endpoint', function() {
      var cardIds = [7, 8, 9];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=7%2C8%2C9').respond(200, []);

      CreditCardMasterFactory.getCardDetails(cardIds);

      $httpBackend.flush();
    });

    it('should handle network timeout', function() {
      var cardIds = [1];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1').respond(0, '');

      var error;
      CreditCardMasterFactory.getCardDetails(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle multiple card IDs correctly', function() {
      var cardIds = [1, 2, 3, 4, 5];
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1111111111111111', cardType: 'Visa', creditLimit: 3000, balance: 500 },
        { cardId: 2, cardNumber: '2222222222222222', cardType: 'MasterCard', creditLimit: 7000, balance: 2000 },
        { cardId: 3, cardNumber: '3333333333333333', cardType: 'Amex', creditLimit: 15000, balance: 8000 },
        { cardId: 4, cardNumber: '4444444444444444', cardType: 'Discover', creditLimit: 6000, balance: 1500 },
        { cardId: 5, cardNumber: '5555555555555555', cardType: 'Visa', creditLimit: 9000, balance: 3000 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/cards?ids=1%2C2%2C3%2C4%2C5').respond(200, mockCardDetails);

      var result;
      CreditCardMasterFactory.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(5);
    });

  });

});

/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered:
  * Successful card details retrieval with multiple IDs
  * Comma-separated query parameter formatting
  * Single card ID handling
  * Promise return validation
  * 500 server error handling
  * 404 not found error handling
  * Empty card details response
  * Correct API endpoint usage
  * Network timeout handling
  * Multiple card IDs (5+) handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/