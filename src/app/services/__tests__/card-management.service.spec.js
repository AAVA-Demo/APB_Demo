/*
Test Documentation:
- Test Name: CardManagementService Unit Tests
- Purpose: Validate CardManagementService functionality including card retrieval, caching, and error handling
- Scenario: Tests cover normal operation, caching behavior, error scenarios, and cache invalidation
- Expected Result: All methods return correct card data, caching works as expected, and errors are handled properly
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, $httpBackend, $rootScope, $q, CreditCardModel;
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
        expiryDate: '12/25',
        isActive: true
      },
      {
        cardId: 'card002',
        userId: 'user123',
        cardNumber: '9876543210987654',
        cardType: 'MasterCard',
        creditLimit: 10000,
        outstandingBalance: 2500,
        availableCredit: 7500,
        expiryDate: '06/26',
        isActive: true
      }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardManagementService_, _$httpBackend_, _$rootScope_, _$q_, _CreditCardModel_) {
      CardManagementService = _CardManagementService_;
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
      CardManagementService.invalidateCache();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify CardManagementService is properly instantiated
    - Scenario: Service is injected
    - Expected Result: Service object and methods exist
    */
    it('should be defined', function() {
      expect(CardManagementService).toBeDefined();
      expect(CardManagementService.getAllCards).toBeDefined();
      expect(CardManagementService.getCardById).toBeDefined();
      expect(CardManagementService.invalidateCache).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should fetch all cards successfully
    - Purpose: Validate successful retrieval of all user cards
    - Scenario: User requests all their credit cards
    - Expected Result: Returns array of CreditCardModel instances
    */
    it('getAllCards - should fetch all cards successfully', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card001');
      expect(result[0].cardType).toBe('Visa');
      expect(result[1].cardId).toBe('card002');
      expect(result[1].cardType).toBe('MasterCard');
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should return cached cards within TTL
    - Purpose: Validate caching mechanism for card data
    - Scenario: Multiple calls to getAllCards within cache TTL
    - Expected Result: Second call returns cached data without HTTP request
    */
    it('getAllCards - should return cached cards within TTL', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      var result1, result2;
      CardManagementService.getAllCards().then(function(cards) {
        result1 = cards;
      });

      $httpBackend.flush();

      CardManagementService.getAllCards().then(function(cards) {
        result2 = cards;
      });

      $rootScope.$digest();

      expect(result1).toBe(result2);
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should handle HTTP errors gracefully
    - Purpose: Validate error handling for failed API requests
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('getAllCards - should handle HTTP errors gracefully', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(500, 'Internal Server Error');

      var errorCaught = false;
      CardManagementService.getAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should handle empty cards array
    - Purpose: Validate handling of user with no cards
    - Scenario: API returns empty array
    - Expected Result: Returns empty array without errors
    */
    it('getAllCards - should handle empty cards array', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, []);

      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardById - should fetch specific card successfully
    - Purpose: Validate retrieval of individual card by ID
    - Scenario: User requests specific card details
    - Expected Result: Returns matching CreditCardModel instance
    */
    it('getCardById - should fetch specific card successfully', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      var result;
      CardManagementService.getCardById('card001').then(function(card) {
        result = card;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.cardId).toBe('card001');
      expect(result.cardType).toBe('Visa');
      expect(result.creditLimit).toBe(5000);
    });

    /*
    Test Documentation:
    - Test Name: getCardById - should use cached data when available
    - Purpose: Validate caching for individual card retrieval
    - Scenario: getCardById called after getAllCards
    - Expected Result: Uses cached data without additional HTTP request
    */
    it('getCardById - should use cached data when available', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      CardManagementService.getAllCards();
      $httpBackend.flush();

      var result;
      CardManagementService.getCardById('card002').then(function(card) {
        result = card;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.cardId).toBe('card002');
    });

    /*
    Test Documentation:
    - Test Name: getCardById - should reject when card not found
    - Purpose: Validate error handling for non-existent card ID
    - Scenario: User requests card that doesn't exist
    - Expected Result: Promise is rejected with 'Card not found' message
    */
    it('getCardById - should reject when card not found', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      var errorMessage;
      CardManagementService.getCardById('nonexistent').catch(function(error) {
        errorMessage = error;
      });

      $httpBackend.flush();

      expect(errorMessage).toBe('Card not found');
    });

    /*
    Test Documentation:
    - Test Name: getCardById - should handle HTTP errors
    - Purpose: Validate error propagation from getAllCards
    - Scenario: API fails when fetching cards for getCardById
    - Expected Result: Promise is rejected with error
    */
    it('getCardById - should handle HTTP errors', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(500, 'Internal Server Error');

      var errorCaught = false;
      CardManagementService.getCardById('card001').catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: invalidateCache - should clear cached data
    - Purpose: Validate cache invalidation functionality
    - Scenario: Cache is populated then invalidated
    - Expected Result: Next getAllCards call makes new HTTP request
    */
    it('invalidateCache - should clear cached data', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      CardManagementService.getAllCards();
      $httpBackend.flush();

      CardManagementService.invalidateCache();

      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, mockCardsData);

      CardManagementService.getAllCards();
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should handle cards with minimum required fields
    - Purpose: Validate handling of cards with minimal data
    - Scenario: API returns cards with only required fields
    - Expected Result: CreditCardModel instances created with default values
    */
    it('getAllCards - should handle cards with minimum required fields', function() {
      var minimalCards = [
        {
          cardId: 'card003',
          userId: 'user123',
          cardNumber: '1111222233334444',
          creditLimit: 3000,
          outstandingBalance: 500
        }
      ];

      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, minimalCards);

      var result;
      CardManagementService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card003');
      expect(result[0].creditLimit).toBe(3000);
    });

    /*
    Test Documentation:
    - Test Name: getAllCards - should handle large number of cards
    - Purpose: Validate performance with multiple cards (up to 20)
    - Scenario: User has maximum allowed cards
    - Expected Result: All cards processed successfully
    */
    it('getAllCards - should handle large number of cards', function() {
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
          isActive: true
        });
      }

      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(200, manyCards);

      var result;
      CardManagementService.getAllCards().then(function(cards) {
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
    - Test Name: getAllCards - should handle 401 unauthorized error
    - Purpose: Validate handling of authentication errors
    - Scenario: API returns 401 unauthorized
    - Expected Result: Promise rejected with error
    */
    it('getAllCards - should handle 401 unauthorized error', function() {
      $httpBackend.expectGET(API_BASE + '/users/' + mockUserId + '/cards')
        .respond(401, 'Unauthorized');

      var errorCaught = false;
      CardManagementService.getAllCards().catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardById, invalidateCache
  - Scenarios covered:
    * Successful card retrieval (single and multiple)
    * Caching mechanism (within TTL)
    * Cache invalidation
    * HTTP error handling (500, 401)
    * Empty cards array
    * Card not found scenario
    * Minimal card data handling
    * Large number of cards (20)
    * Error propagation from getAllCards to getCardById
  - Uncovered scenarios:
    * Cache expiration after TTL (requires time manipulation)
    * Network timeout scenarios
    * Concurrent request handling
    * Card data validation failures
  */
})();