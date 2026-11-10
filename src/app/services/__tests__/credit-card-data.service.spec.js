/*
Test Documentation:
- Test Name: CreditCardDataService Unit Tests
- Purpose: Validate the CreditCardDataService functionality for fetching credit card data
- Scenario: Tests cover successful data retrieval, promise resolution, data structure validation, and edge cases
- Expected Result: All methods return correct mock data with proper structure and handle edge cases appropriately
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService;
    var $q;
    var $rootScope;

    // Load the portfolio module
    beforeEach(module('portfolio'));

    // Inject dependencies
    beforeEach(inject(function(_CreditCardDataService_, _$q_, _$rootScope_) {
      CreditCardDataService = _CreditCardDataService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('Service Initialization', function() {
      /*
      Test Documentation:
      - Test Name: should be defined
      - Purpose: Verify that the service is properly instantiated
      - Scenario: Service is injected into the test
      - Expected Result: Service object is defined and not null
      */
      it('should be defined', function() {
        expect(CreditCardDataService).toBeDefined();
        expect(CreditCardDataService).not.toBeNull();
      });

      /*
      Test Documentation:
      - Test Name: should have fetchAllCards method
      - Purpose: Verify that the service exposes the required public method
      - Scenario: Check for method existence
      - Expected Result: fetchAllCards method exists and is a function
      */
      it('should have fetchAllCards method', function() {
        expect(CreditCardDataService.fetchAllCards).toBeDefined();
        expect(typeof CreditCardDataService.fetchAllCards).toBe('function');
      });
    });

    describe('fetchAllCards - Success Scenarios', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Verify that fetchAllCards returns a promise object
      - Scenario: Call fetchAllCards and check return type
      - Expected Result: Returns an object with then method (promise)
      */
      it('should return a promise', function() {
        var result = CreditCardDataService.fetchAllCards();
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      /*
      Test Documentation:
      - Test Name: should resolve with an array of credit cards
      - Purpose: Verify that the promise resolves with correct data structure
      - Scenario: Call fetchAllCards and verify resolved data is an array
      - Expected Result: Promise resolves with an array
      */
      it('should resolve with an array of credit cards', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return exactly 3 mock credit cards
      - Purpose: Verify the correct number of mock cards is returned
      - Scenario: Call fetchAllCards and count returned cards
      - Expected Result: Returns array with 3 card objects
      */
      it('should return exactly 3 mock credit cards', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          expect(cards.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with all required properties
      - Purpose: Verify that each card object contains all necessary fields
      - Scenario: Call fetchAllCards and validate card structure
      - Expected Result: Each card has cardId, cardNumber, cardType, cardHolderName, totalCreditLimit, outstandingAmount, monthlySpend, expiryDate, status
      */
      it('should return cards with all required properties', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardId).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.cardType).toBeDefined();
            expect(card.cardHolderName).toBeDefined();
            expect(card.totalCreditLimit).toBeDefined();
            expect(card.outstandingAmount).toBeDefined();
            expect(card.monthlySpend).toBeDefined();
            expect(card.expiryDate).toBeDefined();
            expect(card.status).toBeDefined();
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with correct data types
      - Purpose: Verify that card properties have correct data types
      - Scenario: Call fetchAllCards and validate property types
      - Expected Result: String properties are strings, numeric properties are numbers
      */
      it('should return cards with correct data types', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.cardId).toBe('string');
            expect(typeof card.cardNumber).toBe('string');
            expect(typeof card.cardType).toBe('string');
            expect(typeof card.cardHolderName).toBe('string');
            expect(typeof card.totalCreditLimit).toBe('number');
            expect(typeof card.outstandingAmount).toBe('number');
            expect(typeof card.monthlySpend).toBe('number');
            expect(typeof card.expiryDate).toBe('string');
            expect(typeof card.status).toBe('string');
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return first card with correct Visa details
      - Purpose: Verify specific data for the first mock card
      - Scenario: Call fetchAllCards and validate first card data
      - Expected Result: First card is Visa with cardId CC001
      */
      it('should return first card with correct Visa details', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          var firstCard = cards[0];
          expect(firstCard.cardId).toBe('CC001');
          expect(firstCard.cardNumber).toBe('**** **** **** 1234');
          expect(firstCard.cardType).toBe('Visa');
          expect(firstCard.cardHolderName).toBe('John Doe');
          expect(firstCard.totalCreditLimit).toBe(10000);
          expect(firstCard.outstandingAmount).toBe(2500);
          expect(firstCard.monthlySpend).toBe(1200);
          expect(firstCard.expiryDate).toBe('12/25');
          expect(firstCard.status).toBe('Active');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return second card with correct MasterCard details
      - Purpose: Verify specific data for the second mock card
      - Scenario: Call fetchAllCards and validate second card data
      - Expected Result: Second card is MasterCard with cardId CC002
      */
      it('should return second card with correct MasterCard details', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          var secondCard = cards[1];
          expect(secondCard.cardId).toBe('CC002');
          expect(secondCard.cardNumber).toBe('**** **** **** 5678');
          expect(secondCard.cardType).toBe('MasterCard');
          expect(secondCard.totalCreditLimit).toBe(15000);
          expect(secondCard.outstandingAmount).toBe(5000);
          expect(secondCard.monthlySpend).toBe(2300);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return third card with correct Amex details
      - Purpose: Verify specific data for the third mock card
      - Scenario: Call fetchAllCards and validate third card data
      - Expected Result: Third card is Amex with cardId CC003
      */
      it('should return third card with correct Amex details', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          var thirdCard = cards[2];
          expect(thirdCard.cardId).toBe('CC003');
          expect(thirdCard.cardNumber).toBe('**** **** **** 9012');
          expect(thirdCard.cardType).toBe('Amex');
          expect(thirdCard.totalCreditLimit).toBe(20000);
          expect(thirdCard.outstandingAmount).toBe(8000);
          expect(thirdCard.monthlySpend).toBe(3500);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return all cards with Active status
      - Purpose: Verify that all mock cards have Active status
      - Scenario: Call fetchAllCards and check status field
      - Expected Result: All cards have status 'Active'
      */
      it('should return all cards with Active status', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.status).toBe('Active');
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with masked card numbers
      - Purpose: Verify that card numbers are properly masked for security
      - Scenario: Call fetchAllCards and validate card number format
      - Expected Result: All card numbers contain asterisks for masking
      */
      it('should return cards with masked card numbers', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toContain('****');
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('fetchAllCards - Edge Cases', function() {
      /*
      Test Documentation:
      - Test Name: should return same data on multiple calls
      - Purpose: Verify consistency of mock data across multiple invocations
      - Scenario: Call fetchAllCards twice and compare results
      - Expected Result: Both calls return identical data
      */
      it('should return same data on multiple calls', function(done) {
        var firstCall, secondCall;
        CreditCardDataService.fetchAllCards().then(function(cards) {
          firstCall = cards;
          return CreditCardDataService.fetchAllCards();
        }).then(function(cards) {
          secondCall = cards;
          expect(firstCall.length).toBe(secondCall.length);
          expect(firstCall[0].cardId).toBe(secondCall[0].cardId);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with positive credit limits
      - Purpose: Verify that all credit limits are positive numbers
      - Scenario: Call fetchAllCards and validate credit limit values
      - Expected Result: All totalCreditLimit values are greater than 0
      */
      it('should return cards with positive credit limits', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.totalCreditLimit).toBeGreaterThan(0);
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with outstanding amount less than or equal to credit limit
      - Purpose: Verify data integrity - outstanding cannot exceed limit
      - Scenario: Call fetchAllCards and compare outstanding vs limit
      - Expected Result: All cards have outstandingAmount <= totalCreditLimit
      */
      it('should return cards with outstanding amount less than or equal to credit limit', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.outstandingAmount).toBeLessThanOrEqual(card.totalCreditLimit);
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with non-negative outstanding amounts
      - Purpose: Verify that outstanding amounts are valid (non-negative)
      - Scenario: Call fetchAllCards and check outstanding amounts
      - Expected Result: All outstandingAmount values are >= 0
      */
      it('should return cards with non-negative outstanding amounts', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with non-negative monthly spend
      - Purpose: Verify that monthly spend values are valid
      - Scenario: Call fetchAllCards and check monthlySpend values
      - Expected Result: All monthlySpend values are >= 0
      */
      it('should return cards with non-negative monthly spend', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.monthlySpend).toBeGreaterThanOrEqual(0);
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with unique card IDs
      - Purpose: Verify that each card has a unique identifier
      - Scenario: Call fetchAllCards and check for duplicate cardIds
      - Expected Result: All cardId values are unique
      */
      it('should return cards with unique card IDs', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          var cardIds = cards.map(function(card) { return card.cardId; });
          var uniqueIds = cardIds.filter(function(id, index) {
            return cardIds.indexOf(id) === index;
          });
          expect(uniqueIds.length).toBe(cards.length);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with valid expiry date format
      - Purpose: Verify that expiry dates follow MM/YY format
      - Scenario: Call fetchAllCards and validate expiryDate format
      - Expected Result: All expiryDate values match MM/YY pattern
      */
      it('should return cards with valid expiry date format', function(done) {
        CreditCardDataService.fetchAllCards().then(function(cards) {
          var expiryPattern = /^\d{2}\/\d{2}$/;
          cards.forEach(function(card) {
            expect(expiryPattern.test(card.expiryDate)).toBe(true);
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('fetchAllCards - Performance', function() {
      /*
      Test Documentation:
      - Test Name: should resolve promise immediately for mock data
      - Purpose: Verify that mock data is returned without delay
      - Scenario: Call fetchAllCards and measure resolution time
      - Expected Result: Promise resolves synchronously (within same digest cycle)
      */
      it('should resolve promise immediately for mock data', function() {
        var resolved = false;
        CreditCardDataService.fetchAllCards().then(function() {
          resolved = true;
        });
        $rootScope.$apply();
        expect(resolved).toBe(true);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: fetchAllCards
  - Scenarios covered:
    * Service initialization and method availability
    * Promise resolution with correct data structure
    * Correct number of mock cards returned
    * All required card properties present
    * Correct data types for all properties
    * Specific validation for each mock card (Visa, MasterCard, Amex)
    * All cards have Active status
    * Card numbers are properly masked
    * Data consistency across multiple calls
    * Positive credit limits
    * Outstanding amount validation (not exceeding limit)
    * Non-negative financial values
    * Unique card IDs
    * Valid expiry date format
    * Performance (immediate promise resolution)
  - Uncovered scenarios:
    * Real API integration (out of scope - mock service)
    * Network error handling (not applicable for mock)
    * Authentication/authorization (not implemented in mock)
  */
})();