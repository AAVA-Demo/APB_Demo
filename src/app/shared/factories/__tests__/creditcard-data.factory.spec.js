/*
Test Documentation:
- Test Name: CreditCardDataFactory
- Purpose: Validate credit card data factory for fetching card information
- Scenario: Fetching all cards, mock data structure validation
- Expected Result: Credit card data returned with correct structure
*/

describe('CreditCardDataFactory', function() {
  'use strict';
  
  var CreditCardDataFactory, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CreditCardDataFactory_, _$q_, _$rootScope_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('Factory Definition', function() {
    it('should define CreditCardDataFactory', function() {
      expect(CreditCardDataFactory).toBeDefined();
    });
    
    it('should have fetchAllCards method', function() {
      expect(CreditCardDataFactory.fetchAllCards).toBeDefined();
      expect(typeof CreditCardDataFactory.fetchAllCards).toBe('function');
    });
  });
  
  describe('fetchAllCards - Success Scenario', function() {
    it('should return promise', function() {
      var result = CreditCardDataFactory.fetchAllCards();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should fetch credit card data', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        expect(cards).toBeDefined();
        expect(Array.isArray(cards)).toBe(true);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return three credit cards', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        expect(cards.length).toBe(3);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return cards with correct structure', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card).toHaveProperty('cardId');
          expect(card).toHaveProperty('cardNumber');
          expect(card).toHaveProperty('cardType');
          expect(card).toHaveProperty('creditLimit');
          expect(card).toHaveProperty('availableCredit');
          expect(card).toHaveProperty('outstandingAmount');
          expect(card).toHaveProperty('monthlySpend');
          expect(card).toHaveProperty('lastUpdated');
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return Visa Platinum card', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        var visaCard = cards.find(function(c) { return c.cardType === 'Visa Platinum'; });
        expect(visaCard).toBeDefined();
        expect(visaCard.cardId).toBe('CC001');
        expect(visaCard.creditLimit).toBe(100000);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return MasterCard Gold card', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        var masterCard = cards.find(function(c) { return c.cardType === 'MasterCard Gold'; });
        expect(masterCard).toBeDefined();
        expect(masterCard.cardId).toBe('CC002');
        expect(masterCard.creditLimit).toBe(75000);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return Amex Blue card', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        var amexCard = cards.find(function(c) { return c.cardType === 'Amex Blue'; });
        expect(amexCard).toBeDefined();
        expect(amexCard.cardId).toBe('CC003');
        expect(amexCard.creditLimit).toBe(150000);
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('Data Validation', function() {
    it('should have masked card numbers', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardNumber).toContain('****');
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have numeric credit limits', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.creditLimit).toBe('number');
          expect(card.creditLimit).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid available credit', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.availableCredit).toBe('number');
          expect(card.availableCredit).toBeLessThanOrEqual(card.creditLimit);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid outstanding amounts', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.outstandingAmount).toBe('number');
          expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid monthly spend', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.monthlySpend).toBe('number');
          expect(card.monthlySpend).toBeGreaterThanOrEqual(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have lastUpdated as Date object', function(done) {
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.lastUpdated instanceof Date).toBe(true);
        });
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('Edge Cases', function() {
    it('should always resolve promise', function(done) {
      CreditCardDataFactory.fetchAllCards()
        .then(function() {
          expect(true).toBe(true);
          done();
        })
        .catch(function() {
          fail('Promise should not be rejected');
          done();
        });
      $rootScope.$digest();
    });
    
    it('should return consistent data on multiple calls', function(done) {
      var firstCall, secondCall;
      
      CreditCardDataFactory.fetchAllCards().then(function(cards) {
        firstCall = cards;
        return CreditCardDataFactory.fetchAllCards();
      }).then(function(cards) {
        secondCall = cards;
        expect(firstCall.length).toBe(secondCall.length);
        expect(firstCall[0].cardId).toBe(secondCall[0].cardId);
        done();
      });
      
      $rootScope.$digest();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered: Successful fetch, data structure validation, card types, data consistency
- Edge cases: Multiple calls, promise resolution
- Uncovered scenarios: None (mock data always succeeds)
*/