/*
Test Documentation:
- Test Name: CreditCardDataService - fetchUserCreditCards
- Purpose: Validate comprehensive credit card data retrieval including balances and limits
- Scenario: Service fetches detailed credit card information after session validation
- Expected Result: Returns array of credit card objects with complete financial data
*/
/*
Coverage Report:
- Functions tested: fetchUserCreditCards
- Scenarios covered: successful fetch, session validation, data structure validation, balance calculations, rejection on auth failure
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';

  var CreditCardDataService, AuthService, $q, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _AuthService_, _$q_, _$rootScope_, _$timeout_) {
    CreditCardDataService = _CreditCardDataService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('fetchUserCreditCards', function() {
    it('should return a promise', function() {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      var result = CreditCardDataService.fetchUserCreditCards();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should validate session before fetching data', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardDataService.fetchUserCreditCards().then(function() {
        expect(AuthService.validateSession).toHaveBeenCalled();
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should resolve with array of credit cards with complete data', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardDataService.fetchUserCreditCards().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBe(3);
        expect(cards[0].cardId).toBe('CC001');
        expect(cards[0].cardNumber).toBe('****1234');
        expect(cards[0].cardType).toBe('Visa');
        expect(cards[0].creditLimit).toBe(50000);
        expect(cards[0].outstandingAmount).toBe(12000);
        expect(cards[0].availableCredit).toBe(38000);
        expect(cards[0].monthlySpend).toBe(8500);
        expect(cards[0].lastUpdated).toBeDefined();
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should reject when session validation fails', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.reject({valid: false, message: 'Auth failed'}));
      CreditCardDataService.fetchUserCreditCards().catch(function(error) {
        expect(error.valid).toBe(false);
        done();
      });
      $rootScope.$apply();
    });

    it('should return copy of mock data to prevent mutation', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardDataService.fetchUserCreditCards().then(function(cards) {
        cards[0].creditLimit = 99999;
        CreditCardDataService.fetchUserCreditCards().then(function(newCards) {
          expect(newCards[0].creditLimit).toBe(50000);
          done();
        });
        $timeout.flush();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should include all three mock credit cards', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardDataService.fetchUserCreditCards().then(function(cards) {
        var cardIds = cards.map(function(c) { return c.cardId; });
        expect(cardIds).toContain('CC001');
        expect(cardIds).toContain('CC002');
        expect(cardIds).toContain('CC003');
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should have correct available credit calculation', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardDataService.fetchUserCreditCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.availableCredit).toBe(card.creditLimit - card.outstandingAmount);
        });
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });
  });
});