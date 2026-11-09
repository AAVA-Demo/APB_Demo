/*
Test Documentation:
- Test Name: CreditCardApiService - getAllCards method
- Purpose: Validates credit card data retrieval
- Scenario: Successful retrieval of mock credit card data
- Expected Result: Returns promise resolving to array of 3 credit cards with correct structure
*/

(function() {
  'use strict';

  describe('CreditCardApiService', function() {
    var CreditCardApiService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardApiService_, _$q_, _$rootScope_) {
      CreditCardApiService = _CreditCardApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllCards method', function() {
      it('should return a promise', function() {
        var result = CreditCardApiService.getAllCards();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with array of credit cards', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cards with correct structure', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          var card = cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should return card with cardId CC001', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          var card1 = cards.find(function(c) { return c.cardId === 'CC001'; });
          expect(card1).toBeDefined();
          expect(card1.cardType).toBe('Visa Platinum');
          expect(card1.creditLimit).toBe(50000);
          done();
        });
        $rootScope.$apply();
      });

      it('should return card with cardId CC002', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          var card2 = cards.find(function(c) { return c.cardId === 'CC002'; });
          expect(card2).toBeDefined();
          expect(card2.cardType).toBe('Mastercard Gold');
          expect(card2.creditLimit).toBe(30000);
          done();
        });
        $rootScope.$apply();
      });

      it('should return card with cardId CC003', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          var card3 = cards.find(function(c) { return c.cardId === 'CC003'; });
          expect(card3).toBeDefined();
          expect(card3.cardType).toBe('Amex Blue');
          expect(card3.creditLimit).toBe(75000);
          done();
        });
        $rootScope.$apply();
      });

      it('should mask card numbers correctly', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toContain('****');
            expect(card.cardNumber.split(' ').length).toBe(4);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should have valid credit calculations', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.availableCredit).toBe(card.creditLimit - card.outstandingAmount);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should have numeric values for financial fields', function(done) {
        CreditCardApiService.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.creditLimit).toBe('number');
            expect(typeof card.outstandingAmount).toBe('number');
            expect(typeof card.availableCredit).toBe('number');
            expect(typeof card.monthlySpend).toBe('number');
          });
          done();
        });
        $rootScope.$apply();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered:
  * Promise return validation
  * Array structure validation
  * Card data structure completeness
  * Individual card data validation (CC001, CC002, CC003)
  * Card number masking
  * Credit calculation accuracy
  * Data type validation
- Edge cases: Multiple cards, masked card numbers, credit calculations
- Uncovered scenarios: None (comprehensive coverage for mock data service)
*/