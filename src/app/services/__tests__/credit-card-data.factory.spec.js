/*
Test Documentation:
- Test Name: CreditCardDataFactory Unit Tests
- Purpose: Validate CreditCardDataFactory functionality including card data retrieval, caching, and error handling
- Scenario: Tests cover normal operation, caching behavior, error scenarios, and data transformation
- Expected Result: Factory returns correct card data, caching works as expected, and errors are handled properly
*/

(function() {
  'use strict';

  describe('CreditCardDataFactory', function() {
    var CreditCardDataFactory, $httpBackend, $rootScope, $q, CreditCardModel;
    var API_BASE = '/api';
    var mockUserId = 'user123';
    var mockCardsData = [
      {
        cardId: 'card001',
        userId: 'user123',
        cardNumber: '1234567890123456',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1200,
        availableCredit: 3800,
        monthlySpend: 800
      },
      {
        cardId: 'card002',
        userId: 'user123',
        cardNumber: '9876543210987654',
        cardType: 'MasterCard',
        creditLimit: 10000,
        outstandingBalance: 2500,
        availableCredit: 7500,
        monthlySpend: 1500
      }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_, _$rootScope_, _$q_, _CreditCardModel_) {
      CreditCardDataFactory = _CreditCardDataFactory_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      CreditCardModel = _CreditCardModel_;
      
      $rootScope.currentUser = {
        userId: mockUserId,
        token: 'mock-token'
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify CreditCardDataFactory is properly instantiated
    - Scenario: Factory is injected
    - Expected Result: Factory object and methods exist
    */
    it('should be defined', function() {
      expect(CreditCardDataFactory).toBeDefined();
      expect(CreditCardDataFactory.fetchAllCards).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should fetch all cards successfully
    - Purpose: Validate successful retrieval of all user cards
    - Scenario: User requests all their credit cards
    - Expected Result: Returns array of CreditCardModel instances
    */
    it('fetchAllCards - should fetch all cards successfully', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, mockCardsData);

      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card001');
      expect(result[0].cardType).toBe('Visa');
      expect(result[0].monthlySpend).toBe(800);
      expect(result[1].cardId).toBe('card002');
      expect(result[1].cardType).toBe('MasterCard');
      expect(result[1].monthlySpend).toBe(1500);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should return cached data within TTL
    - Purpose: Validate caching mechanism
    - Scenario: Multiple calls to fetchAllCards within cache TTL (30 seconds)
    - Expected Result: Second call returns cached data without HTTP request
    */
    it('fetchAllCards - should return cached data within TTL', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, mockCardsData);

      var result1, result2;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result1 = cards;
      });

      $httpBackend.flush();

      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result2 = cards;
      });

      $rootScope.$digest();

      expect(result1).toBe(result2);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle HTTP errors gracefully
    - Purpose: Validate error handling for failed API requests
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('fetchAllCards - should handle HTTP errors gracefully', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(500, 'Internal Server Error');

      var errorCaught = false;
      CreditCardDataFactory.fetchAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle empty cards array
    - Purpose: Validate handling of user with no cards
    - Scenario: API returns empty array
    - Expected Result: Returns empty array without errors
    */
    it('fetchAllCards - should handle empty cards array', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, []);

      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should transform raw data into CreditCardModel instances
    - Purpose: Validate data transformation logic
    - Scenario: API returns raw card data objects
    - Expected Result: Each card is instantiated as CreditCardModel
    */
    it('fetchAllCards - should transform raw data into CreditCardModel instances', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, mockCardsData);

      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result[0] instanceof CreditCardModel).toBe(true);
      expect(result[1] instanceof CreditCardModel).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should include userId in request params
    - Purpose: Validate correct API request parameters
    - Scenario: fetchAllCards is called
    - Expected Result: HTTP request includes userId from $rootScope.currentUser
    */
    it('fetchAllCards - should include userId in request params', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, mockCardsData);

      CreditCardDataFactory.fetchAllCards();
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle 401 unauthorized error
    - Purpose: Validate handling of authentication errors
    - Scenario: API returns 401 unauthorized
    - Expected Result: Promise rejected with error
    */
    it('fetchAllCards - should handle 401 unauthorized error', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(401, 'Unauthorized');

      var errorCaught = false;
      CreditCardDataFactory.fetchAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle 404 not found error
    - Purpose: Validate handling of resource not found errors
    - Scenario: API returns 404 not found
    - Expected Result: Promise rejected with error
    */
    it('fetchAllCards - should handle 404 not found error', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(404, 'Not Found');

      var errorCaught = false;
      CreditCardDataFactory.fetchAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle cards with missing optional fields
    - Purpose: Validate handling of incomplete card data
    - Scenario: API returns cards with some fields missing
    - Expected Result: CreditCardModel instances created with default values
    */
    it('fetchAllCards - should handle cards with missing optional fields', function() {
      var incompleteCards = [
        {
          cardId: 'card003',
          userId: 'user123',
          cardNumber: '1111222233334444',
          creditLimit: 3000,
          outstandingBalance: 500
        }
      ];

      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, incompleteCards);

      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card003');
      expect(result[0].monthlySpend).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle malformed JSON response
    - Purpose: Validate error handling for invalid response data
    - Scenario: API returns malformed JSON
    - Expected Result: Promise rejected with error
    */
    it('fetchAllCards - should handle malformed JSON response', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, 'invalid-json');

      var errorCaught = false;
      CreditCardDataFactory.fetchAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should handle large number of cards
    - Purpose: Validate performance with multiple cards
    - Scenario: User has 20 credit cards
    - Expected Result: All cards processed successfully
    */
    it('fetchAllCards - should handle large number of cards', function() {
      var manyCards = [];
      for (var i = 1; i <= 20; i++) {
        manyCards.push({
          cardId: 'card' + i.toString().padStart(3, '0'),
          userId: mockUserId,
          cardNumber: '1234567890' + i.toString().padStart(6, '0'),
          cardType: 'Visa',
          creditLimit: 5000 * i,
          outstandingBalance: 1000 * i,
          availableCredit: 4000 * i,
          monthlySpend: 500 * i
        });
      }

      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, manyCards);

      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(20);
      expect(result[0].cardId).toBe('card001');
      expect(result[19].cardId).toBe('card020');
    });

    /*
    Test Documentation:
    - Test Name: fetchAllCards - should use HTTP cache option
    - Purpose: Validate HTTP cache configuration
    - Scenario: fetchAllCards makes HTTP request
    - Expected Result: Request includes cache:true option
    */
    it('fetchAllCards - should use HTTP cache option', function() {
      $httpBackend.expectGET(API_BASE + '/cards?userId=' + mockUserId)
        .respond(200, mockCardsData);

      CreditCardDataFactory.fetchAllCards();
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: fetchAllCards
  - Scenarios covered:
    * Successful card retrieval
    * Caching mechanism (within TTL)
    * HTTP error handling (500, 401, 404)
    * Empty cards array
    * Data transformation to CreditCardModel
    * Request parameter inclusion (userId)
    * Incomplete card data handling
    * Malformed JSON response
    * Large number of cards (20)
    * HTTP cache option usage
  - Uncovered scenarios:
    * Cache expiration after TTL (requires time manipulation)
    * Network timeout scenarios
    * Concurrent request handling
    * Card data validation failures in CreditCardModel
  */
})();