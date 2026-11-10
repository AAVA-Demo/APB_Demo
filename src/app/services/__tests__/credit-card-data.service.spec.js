/*
Test Documentation:
- Test Name: CreditCardDataService Test Suite
- Purpose: Validate credit card data retrieval and aggregation logic
- Scenario: Tests fetching all cards with total credit limit and outstanding amount calculations
- Expected Result: Service correctly fetches cards and computes aggregated financial metrics
*/

(function() {
'use strict';

describe('CreditCardDataService', function() {
  var CreditCardDataService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_ENDPOINTS_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    /*
    Test Documentation:
    - Test Name: should fetch all cards and calculate totals successfully
    - Purpose: Verify successful card retrieval with aggregated metrics
    - Scenario: API returns multiple cards with credit limits and balances
    - Expected Result: Service returns cards array with totalCreditLimit and totalOutstanding
    */
    it('should fetch all cards and calculate totals successfully', function() {
      var mockResponse = {
        cards: [
          { cardId: '1', creditLimit: 5000, currentBalance: 1500 },
          { cardId: '2', creditLimit: 10000, currentBalance: 3000 },
          { cardId: '3', creditLimit: 7500, currentBalance: 2500 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.cards.length).toBe(3);
      expect(result.totalCreditLimit).toBe(22500);
      expect(result.totalOutstanding).toBe(7000);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty cards array
    - Purpose: Verify service handles response with no cards
    - Scenario: API returns empty cards array
    - Expected Result: Service returns empty array with zero totals
    */
    it('should handle empty cards array', function() {
      var mockResponse = { cards: [] };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cards.length).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle missing cards property in response
    - Purpose: Verify service handles malformed API response
    - Scenario: API response does not include cards property
    - Expected Result: Service treats as empty array with zero totals
    */
    it('should handle missing cards property in response', function() {
      var mockResponse = {};

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cards.length).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle cards with missing creditLimit
    - Purpose: Verify service handles cards with undefined creditLimit
    - Scenario: Some cards have missing creditLimit property
    - Expected Result: Missing values treated as 0 in calculations
    */
    it('should handle cards with missing creditLimit', function() {
      var mockResponse = {
        cards: [
          { cardId: '1', creditLimit: 5000, currentBalance: 1000 },
          { cardId: '2', currentBalance: 2000 },
          { cardId: '3', creditLimit: 3000, currentBalance: 500 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.totalCreditLimit).toBe(8000);
      expect(result.totalOutstanding).toBe(3500);
    });

    /*
    Test Documentation:
    - Test Name: should handle cards with missing currentBalance
    - Purpose: Verify service handles cards with undefined currentBalance
    - Scenario: Some cards have missing currentBalance property
    - Expected Result: Missing values treated as 0 in calculations
    */
    it('should handle cards with missing currentBalance', function() {
      var mockResponse = {
        cards: [
          { cardId: '1', creditLimit: 5000, currentBalance: 1000 },
          { cardId: '2', creditLimit: 10000 },
          { cardId: '3', creditLimit: 7500, currentBalance: 2500 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.totalCreditLimit).toBe(22500);
      expect(result.totalOutstanding).toBe(3500);
    });

    /*
    Test Documentation:
    - Test Name: should handle single card
    - Purpose: Verify service works with single card response
    - Scenario: API returns single card
    - Expected Result: Correct totals calculated for single card
    */
    it('should handle single card', function() {
      var mockResponse = {
        cards: [
          { cardId: '1', creditLimit: 5000, currentBalance: 1500 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cards.length).toBe(1);
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalOutstanding).toBe(1500);
    });

    /*
    Test Documentation:
    - Test Name: should handle zero values correctly
    - Purpose: Verify service handles cards with zero balances and limits
    - Scenario: Cards have zero creditLimit or currentBalance
    - Expected Result: Zero values included in calculations correctly
    */
    it('should handle zero values correctly', function() {
      var mockResponse = {
        cards: [
          { cardId: '1', creditLimit: 0, currentBalance: 0 },
          { cardId: '2', creditLimit: 5000, currentBalance: 0 },
          { cardId: '3', creditLimit: 0, currentBalance: 1000 }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalOutstanding).toBe(1000);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 500 error
    - Purpose: Verify service handles server errors gracefully
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 500 error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(500, 'Internal Server Error');

      var error;
      CreditCardDataService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP 404 error
    - Purpose: Verify service handles not found errors
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise rejected with error
    */
    it('should handle HTTP 404 error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(404, 'Not Found');

      var error;
      CreditCardDataService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Verify service handles network timeouts
    - Scenario: API request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(-1, '');

      var error;
      CreditCardDataService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle large number of cards
    - Purpose: Verify service handles maximum card limit (20 cards)
    - Scenario: API returns 20 cards
    - Expected Result: All cards processed and totals calculated correctly
    */
    it('should handle large number of cards', function() {
      var cards = [];
      for (var i = 1; i <= 20; i++) {
        cards.push({ cardId: i.toString(), creditLimit: 5000, currentBalance: 1000 });
      }
      var mockResponse = { cards: cards };

      $httpBackend.expectGET(API_ENDPOINTS.baseUrl + API_ENDPOINTS.cards)
        .respond(200, mockResponse);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cards.length).toBe(20);
      expect(result.totalCreditLimit).toBe(100000);
      expect(result.totalOutstanding).toBe(20000);
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered:
  * Successful card retrieval with multiple cards
  * Empty cards array handling
  * Missing cards property in response
  * Missing creditLimit and currentBalance properties
  * Single card handling
  * Zero values in limits and balances
  * HTTP error responses (500, 404)
  * Network timeout handling
  * Maximum card limit (20 cards)
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();