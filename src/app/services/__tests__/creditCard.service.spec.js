/*
Test Documentation:
- Test Name: CreditCardService - fetchUserCards
- Purpose: Validate credit card data retrieval with authentication
- Scenario: Service fetches user credit cards after validating session
- Expected Result: Returns array of credit card objects with cardId, cardNumber, and cardType
*/
/*
Coverage Report:
- Functions tested: fetchUserCards
- Scenarios covered: successful fetch with valid session, rejection on invalid session, promise resolution, data structure validation
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';

  var CreditCardService, AuthService, $q, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardService_, _AuthService_, _$q_, _$rootScope_, _$timeout_) {
    CreditCardService = _CreditCardService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('fetchUserCards', function() {
    it('should return a promise', function() {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      var result = CreditCardService.fetchUserCards();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should validate session before fetching cards', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardService.fetchUserCards().then(function() {
        expect(AuthService.validateSession).toHaveBeenCalled();
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should resolve with array of credit cards on valid session', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardService.fetchUserCards().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBe(3);
        expect(cards[0].cardId).toBe('CC001');
        expect(cards[0].cardNumber).toBe('****1234');
        expect(cards[0].cardType).toBe('Visa');
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should reject when session validation fails', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.reject({valid: false, message: 'Invalid session'}));
      CreditCardService.fetchUserCards().catch(function(error) {
        expect(error.valid).toBe(false);
        expect(error.message).toBe('Invalid session');
        done();
      });
      $rootScope.$apply();
    });

    it('should return copy of mock cards data', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardService.fetchUserCards().then(function(cards) {
        cards[0].cardType = 'Modified';
        CreditCardService.fetchUserCards().then(function(newCards) {
          expect(newCards[0].cardType).toBe('Visa');
          done();
        });
        $timeout.flush();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should include all expected card types', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      CreditCardService.fetchUserCards().then(function(cards) {
        var cardTypes = cards.map(function(c) { return c.cardType; });
        expect(cardTypes).toContain('Visa');
        expect(cardTypes).toContain('MasterCard');
        expect(cardTypes).toContain('Amex');
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });
  });
});