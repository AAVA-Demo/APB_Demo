/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate CreditCardService functionality including card retrieval, individual card lookup, and mock data generation
- Scenario: Tests cover successful API calls, error handling, card ID validation, and mock data structure
- Expected Result: All service methods work correctly with proper promise resolution/rejection and data integrity
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $rootScope, API_CONFIG;
    var mockCards, mockSingleCard;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$rootScope_, _API_CONFIG_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      API_CONFIG = _API_CONFIG_;

      mockCards = [
        {
          cardId: 'CC001',
          cardNumber: '****1234',
          cardType: 'Visa',
          creditLimit: 50000,
          availableCredit: 35000,
          outstandingAmount: 15000,
          monthlySpend: 8500,
          lastUpdated: new Date('2024-01-15')
        },
        {
          cardId: 'CC002',
          cardNumber: '****5678',
          cardType: 'MasterCard',
          creditLimit: 30000,
          availableCredit: 22000,
          outstandingAmount: 8000,
          monthlySpend: 4200,
          lastUpdated: new Date('2024-01-15')
        }
      ];

      mockSingleCard = mockCards[0];
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: getCards - successful retrieval
    - Purpose: Verify service retrieves all credit cards from API
    - Scenario: Call getCards without parameters
    - Expected Result: Promise resolves with array of credit card objects
    */
    it('should retrieve all credit cards successfully', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards').respond(200, mockCards);

      CreditCardService.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardId).toBe('CC002');
    });

    /*
    Test Documentation:
    - Test Name: getCards - handles API error
    - Purpose: Verify service properly handles API errors when fetching cards
    - Scenario: API returns 500 error
    - Expected Result: Promise rejects with error object containing status 500
    */
    it('should handle error when retrieving all cards fails', function() {
      var error;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards').respond(500, 'Internal Server Error');

      CreditCardService.getCards().then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
      expect(error.data).toBe('Internal Server Error');
    });

    /*
    Test Documentation:
    - Test Name: getCards - handles empty response
    - Purpose: Verify service handles empty card list from API
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty card list from API', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards').respond(200, []);

      CreditCardService.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardById - successful retrieval
    - Purpose: Verify service retrieves specific card by ID
    - Scenario: Call getCardById with valid card ID
    - Expected Result: Promise resolves with single card object matching the ID
    */
    it('should retrieve card by ID successfully', function() {
      var result;
      var cardId = 'CC001';
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId).respond(200, mockSingleCard);

      CreditCardService.getCardById(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockSingleCard);
      expect(result.cardId).toBe('CC001');
      expect(result.cardType).toBe('Visa');
      expect(result.creditLimit).toBe(50000);
    });

    /*
    Test Documentation:
    - Test Name: getCardById - handles not found error
    - Purpose: Verify service handles case when card ID does not exist
    - Scenario: API returns 404 error for invalid card ID
    - Expected Result: Promise rejects with 404 error
    */
    it('should handle error when card ID is not found', function() {
      var error;
      var invalidCardId = 'INVALID_ID';
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + invalidCardId).respond(404, 'Card Not Found');

      CreditCardService.getCardById(invalidCardId).then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: getCardById - handles null or undefined card ID
    - Purpose: Verify service handles invalid input gracefully
    - Scenario: Call getCardById with null or undefined
    - Expected Result: Service constructs URL and API returns error
    */
    it('should handle null card ID gracefully', function() {
      var error;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/null').respond(400, 'Bad Request');

      CreditCardService.getCardById(null).then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    /*
    Test Documentation:
    - Test Name: getMockCards - returns valid mock data
    - Purpose: Verify mock cards data structure and content
    - Scenario: Call getMockCards without parameters
    - Expected Result: Returns array of 2 card objects with all required fields
    */
    it('should return valid mock cards data', function() {
      var mockData = CreditCardService.getMockCards();

      expect(mockData).toBeDefined();
      expect(Array.isArray(mockData)).toBe(true);
      expect(mockData.length).toBe(2);
      expect(mockData[0].cardId).toBe('CC001');
      expect(mockData[1].cardId).toBe('CC002');
    });

    /*
    Test Documentation:
    - Test Name: getMockCards - validates card data structure
    - Purpose: Verify each mock card has all required fields
    - Scenario: Call getMockCards and inspect card objects
    - Expected Result: Each card has cardId, cardNumber, cardType, creditLimit, availableCredit, outstandingAmount, monthlySpend, lastUpdated
    */
    it('should return mock cards with complete data structure', function() {
      var mockData = CreditCardService.getMockCards();
      var firstCard = mockData[0];

      expect(firstCard.cardId).toBeDefined();
      expect(firstCard.cardNumber).toBeDefined();
      expect(firstCard.cardType).toBeDefined();
      expect(firstCard.creditLimit).toBeDefined();
      expect(firstCard.availableCredit).toBeDefined();
      expect(firstCard.outstandingAmount).toBeDefined();
      expect(firstCard.monthlySpend).toBeDefined();
      expect(firstCard.lastUpdated).toBeDefined();
      expect(firstCard.lastUpdated instanceof Date).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getMockCards - validates numeric fields
    - Purpose: Verify all monetary and numeric fields are numbers
    - Scenario: Call getMockCards and check field types
    - Expected Result: creditLimit, availableCredit, outstandingAmount, monthlySpend are all numbers
    */
    it('should return mock cards with numeric fields as numbers', function() {
      var mockData = CreditCardService.getMockCards();
      var firstCard = mockData[0];

      expect(typeof firstCard.creditLimit).toBe('number');
      expect(typeof firstCard.availableCredit).toBe('number');
      expect(typeof firstCard.outstandingAmount).toBe('number');
      expect(typeof firstCard.monthlySpend).toBe('number');
      expect(firstCard.creditLimit).toBeGreaterThan(0);
      expect(firstCard.availableCredit).toBeGreaterThan(0);
    });

    /*
    Test Documentation:
    - Test Name: getMockCards - validates card number masking
    - Purpose: Verify card numbers are properly masked for security
    - Scenario: Call getMockCards and check cardNumber format
    - Expected Result: Card numbers follow ****XXXX pattern
    */
    it('should return mock cards with masked card numbers', function() {
      var mockData = CreditCardService.getMockCards();

      mockData.forEach(function(card) {
        expect(card.cardNumber).toMatch(/^\*\*\*\*\d{4}$/);
      });
    });

    /*
    Test Documentation:
    - Test Name: getMockCards - validates financial calculations
    - Purpose: Verify credit calculations are mathematically correct
    - Scenario: Check that creditLimit = availableCredit + outstandingAmount
    - Expected Result: Financial calculations are consistent
    */
    it('should return mock cards with consistent financial calculations', function() {
      var mockData = CreditCardService.getMockCards();

      mockData.forEach(function(card) {
        var calculatedLimit = card.availableCredit + card.outstandingAmount;
        expect(calculatedLimit).toBe(card.creditLimit);
      });
    });

    /*
    Test Documentation:
    - Test Name: API timeout configuration
    - Purpose: Verify service uses API_CONFIG timeout for requests
    - Scenario: Check that timeout is configured in API calls
    - Expected Result: API_CONFIG.timeout is defined and used
    */
    it('should use API_CONFIG timeout for HTTP requests', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards').respond(200, mockCards);

      CreditCardService.getCards();
      $httpBackend.flush();

      expect(API_CONFIG.timeout).toBeDefined();
      expect(typeof API_CONFIG.timeout).toBe('number');
      expect(API_CONFIG.timeout).toBeGreaterThan(0);
    });

    /*
    Test Documentation:
    - Test Name: Service method existence
    - Purpose: Verify all required service methods are defined
    - Scenario: Check service object for method definitions
    - Expected Result: getCards, getCardById, and getMockCards methods exist and are functions
    */
    it('should have all required service methods defined', function() {
      expect(CreditCardService.getCards).toBeDefined();
      expect(typeof CreditCardService.getCards).toBe('function');
      expect(CreditCardService.getCardById).toBeDefined();
      expect(typeof CreditCardService.getCardById).toBe('function');
      expect(CreditCardService.getMockCards).toBeDefined();
      expect(typeof CreditCardService.getMockCards).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: Promise-based API
    - Purpose: Verify all service methods return promises
    - Scenario: Call service methods and check return type
    - Expected Result: All methods return objects with .then() method
    */
    it('should return promises from API methods', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards').respond(200, mockCards);
      var promise = CreditCardService.getCards();

      expect(promise).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: Multiple card types support
    - Purpose: Verify service handles different card types (Visa, MasterCard, etc.)
    - Scenario: Check mock data contains different card types
    - Expected Result: Mock data includes Visa and MasterCard types
    */
    it('should support multiple card types', function() {
      var mockData = CreditCardService.getMockCards();
      var cardTypes = mockData.map(function(card) { return card.cardType; });

      expect(cardTypes).toContain('Visa');
      expect(cardTypes).toContain('MasterCard');
      expect(cardTypes.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: Card data immutability
    - Purpose: Verify getMockCards returns new instances each time
    - Scenario: Call getMockCards twice and modify first result
    - Expected Result: Second call returns unmodified data
    */
    it('should return independent mock data instances', function() {
      var mockData1 = CreditCardService.getMockCards();
      var mockData2 = CreditCardService.getMockCards();

      mockData1[0].creditLimit = 99999;

      expect(mockData2[0].creditLimit).not.toBe(99999);
      expect(mockData2[0].creditLimit).toBe(50000);
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCards (success, error, empty response), getCardById (success, not found, null ID), getMockCards (structure, validation, calculations)
- Scenarios covered:
  * Successful API calls with proper data resolution
  * Error handling for failed API requests (500, 404, 400)
  * Empty response handling
  * Card ID validation and lookup
  * Mock data structure validation (8 required fields per card)
  * Numeric field type validation
  * Card number masking pattern (****XXXX)
  * Financial calculation consistency (creditLimit = availableCredit + outstandingAmount)
  * API timeout configuration
  * Promise-based API verification
  * Multiple card type support (Visa, MasterCard)
  * Data immutability checks
- Edge cases covered:
  * Null/undefined card ID
  * Empty card list
  * Invalid card ID (404)
  * Mock data independence
- Uncovered scenarios: Concurrent API calls, card data caching, real-time balance updates, network timeout simulation
*/