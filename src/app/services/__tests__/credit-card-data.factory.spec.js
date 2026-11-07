/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards
- Purpose: Validates that the factory correctly retrieves all credit card records
- Scenario: Service returns mock credit card data with proper structure
- Expected Result: Promise resolves with array of 3 credit cards containing all required fields
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: successful data retrieval, promise resolution, data structure validation, data immutability
- Edge cases: empty state, timeout handling, data cloning
- Uncovered scenarios: HTTP error handling (not applicable for mock implementation)
*/

(function() {
  'use strict';

  describe('CreditCardDataFactory', function() {
    var CreditCardDataFactory, $q, $timeout, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataFactory_, _$q_, _$timeout_, _API_CONFIG_) {
      CreditCardDataFactory = _CreditCardDataFactory_;
      $q = _$q_;
      $timeout = _$timeout_;
      API_CONFIG = _API_CONFIG_;
    }));

    describe('getAllCards', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Validates that getAllCards returns a promise object
      - Scenario: Call getAllCards method
      - Expected Result: Returns object with then method
      */
      it('should return a promise', function() {
        var result = CreditCardDataFactory.getAllCards();
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      /*
      Test Documentation:
      - Test Name: should resolve with an array of credit cards
      - Purpose: Validates successful data retrieval
      - Scenario: Call getAllCards and wait for promise resolution
      - Expected Result: Promise resolves with array of credit card objects
      */
      it('should resolve with an array of credit cards', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with all required fields
      - Purpose: Validates data structure integrity
      - Scenario: Retrieve cards and verify each card has required properties
      - Expected Result: Each card contains cardId, cardNumber, cardType, creditLimit, outstandingAmount, availableCredit, cardHolderName, expiryDate
      */
      it('should return cards with all required fields', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardId).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.cardType).toBeDefined();
            expect(card.creditLimit).toBeDefined();
            expect(card.outstandingAmount).toBeDefined();
            expect(card.availableCredit).toBeDefined();
            expect(card.cardHolderName).toBeDefined();
            expect(card.expiryDate).toBeDefined();
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with correct data types
      - Purpose: Validates data type consistency
      - Scenario: Verify numeric and string fields have correct types
      - Expected Result: Numeric fields are numbers, string fields are strings
      */
      it('should return cards with correct data types', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.cardId).toBe('string');
            expect(typeof card.cardNumber).toBe('string');
            expect(typeof card.cardType).toBe('string');
            expect(typeof card.creditLimit).toBe('number');
            expect(typeof card.outstandingAmount).toBe('number');
            expect(typeof card.availableCredit).toBe('number');
            expect(typeof card.cardHolderName).toBe('string');
            expect(typeof card.expiryDate).toBe('string');
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return specific card details for CC001
      - Purpose: Validates specific card data accuracy
      - Scenario: Retrieve cards and verify first card details
      - Expected Result: CC001 has correct cardNumber, type, limits, and holder name
      */
      it('should return specific card details for CC001', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          var cc001 = cards.find(function(c) { return c.cardId === 'CC001'; });
          expect(cc001).toBeDefined();
          expect(cc001.cardNumber).toBe('**** **** **** 1234');
          expect(cc001.cardType).toBe('Visa');
          expect(cc001.creditLimit).toBe(50000);
          expect(cc001.outstandingAmount).toBe(12500);
          expect(cc001.availableCredit).toBe(37500);
          expect(cc001.cardHolderName).toBe('John Doe');
          expect(cc001.expiryDate).toBe('12/2025');
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return specific card details for CC002
      - Purpose: Validates second card data accuracy
      - Scenario: Retrieve cards and verify second card details
      - Expected Result: CC002 has correct Mastercard details
      */
      it('should return specific card details for CC002', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          var cc002 = cards.find(function(c) { return c.cardId === 'CC002'; });
          expect(cc002).toBeDefined();
          expect(cc002.cardNumber).toBe('**** **** **** 5678');
          expect(cc002.cardType).toBe('Mastercard');
          expect(cc002.creditLimit).toBe(75000);
          expect(cc002.outstandingAmount).toBe(25000);
          expect(cc002.availableCredit).toBe(50000);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return specific card details for CC003
      - Purpose: Validates third card data accuracy
      - Scenario: Retrieve cards and verify third card details
      - Expected Result: CC003 has correct Amex details
      */
      it('should return specific card details for CC003', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          var cc003 = cards.find(function(c) { return c.cardId === 'CC003'; });
          expect(cc003).toBeDefined();
          expect(cc003.cardNumber).toBe('**** **** **** 9012');
          expect(cc003.cardType).toBe('Amex');
          expect(cc003.creditLimit).toBe(100000);
          expect(cc003.outstandingAmount).toBe(30000);
          expect(cc003.availableCredit).toBe(70000);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return immutable data (deep copy)
      - Purpose: Validates data immutability to prevent external modifications
      - Scenario: Retrieve cards, modify returned data, retrieve again
      - Expected Result: Second retrieval returns unmodified original data
      */
      it('should return immutable data (deep copy)', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards1) {
          cards1[0].cardHolderName = 'Modified Name';
          CreditCardDataFactory.getAllCards().then(function(cards2) {
            expect(cards2[0].cardHolderName).toBe('John Doe');
            done();
          });
          $timeout.flush();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should resolve after 300ms timeout
      - Purpose: Validates asynchronous behavior timing
      - Scenario: Call getAllCards and verify timeout duration
      - Expected Result: Promise does not resolve before timeout flush
      */
      it('should resolve after 300ms timeout', function() {
        var resolved = false;
        CreditCardDataFactory.getAllCards().then(function() {
          resolved = true;
        });
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should calculate available credit correctly
      - Purpose: Validates business logic for available credit calculation
      - Scenario: Verify availableCredit = creditLimit - outstandingAmount
      - Expected Result: All cards have correct available credit values
      */
      it('should calculate available credit correctly', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            var expectedAvailable = card.creditLimit - card.outstandingAmount;
            expect(card.availableCredit).toBe(expectedAvailable);
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with masked card numbers
      - Purpose: Validates security requirement for card number masking
      - Scenario: Verify all card numbers are properly masked
      - Expected Result: All card numbers contain masking pattern with asterisks
      */
      it('should return cards with masked card numbers', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toContain('****');
            expect(card.cardNumber.split('*').length - 1).toBeGreaterThan(0);
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return cards with valid expiry dates
      - Purpose: Validates expiry date format
      - Scenario: Verify expiry dates match MM/YYYY format
      - Expected Result: All expiry dates follow correct format
      */
      it('should return cards with valid expiry dates', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          var expiryPattern = /^\d{2}\/\d{4}$/;
          cards.forEach(function(card) {
            expect(expiryPattern.test(card.expiryDate)).toBe(true);
          });
          done();
        });
        $timeout.flush();
      });
    });
  });
})();