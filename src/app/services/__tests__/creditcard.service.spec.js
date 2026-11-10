/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate CreditCardService functionality for credit card data retrieval
- Scenario: Tests getAllCards with various response scenarios and error handling
- Expected Result: Service correctly retrieves all credit cards and handles errors appropriately
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService;
    var $httpBackend;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all credit cards successfully', function() {
        var mockCards = [
          {
            cardId: '1',
            cardNumber: '**** 1234',
            cardBrand: 'Visa',
            creditLimit: 10000,
            availableCredit: 7000,
            outstandingAmount: 3000
          },
          {
            cardId: '2',
            cardNumber: '**** 5678',
            cardBrand: 'Mastercard',
            creditLimit: 15000,
            availableCredit: 12000,
            outstandingAmount: 3000
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardBrand).toBe('Visa');
        expect(result[1].cardBrand).toBe('Mastercard');
      });

      it('should handle empty cards array', function() {
        var mockCards = [];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle server error', function() {
        $httpBackend.expectGET('/api/cards').respond(500, 'Internal Server Error');

        var error;
        CreditCardService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        $httpBackend.expectGET('/api/cards').respond(0, '');

        var error;
        CreditCardService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });

      it('should handle unauthorized access', function() {
        $httpBackend.expectGET('/api/cards').respond(401, 'Unauthorized');

        var error;
        CreditCardService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should return cards with all required fields', function() {
        var mockCards = [
          {
            cardId: '1',
            cardNumber: '**** 1234',
            cardBrand: 'Visa',
            creditLimit: 10000,
            availableCredit: 7000,
            outstandingAmount: 3000
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result[0]).toHaveProperty('cardId');
        expect(result[0]).toHaveProperty('cardNumber');
        expect(result[0]).toHaveProperty('cardBrand');
        expect(result[0]).toHaveProperty('creditLimit');
        expect(result[0]).toHaveProperty('availableCredit');
        expect(result[0]).toHaveProperty('outstandingAmount');
      });

      it('should handle cards with zero credit limit', function() {
        var mockCards = [
          {
            cardId: '1',
            cardNumber: '**** 1234',
            cardBrand: 'Visa',
            creditLimit: 0,
            availableCredit: 0,
            outstandingAmount: 0
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result[0].creditLimit).toBe(0);
        expect(result[0].availableCredit).toBe(0);
        expect(result[0].outstandingAmount).toBe(0);
      });

      it('should handle cards with maximum credit utilization', function() {
        var mockCards = [
          {
            cardId: '1',
            cardNumber: '**** 1234',
            cardBrand: 'Visa',
            creditLimit: 10000,
            availableCredit: 0,
            outstandingAmount: 10000
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result[0].availableCredit).toBe(0);
        expect(result[0].outstandingAmount).toBe(result[0].creditLimit);
      });

      it('should handle multiple card brands', function() {
        var mockCards = [
          {cardId: '1', cardBrand: 'Visa', creditLimit: 10000},
          {cardId: '2', cardBrand: 'Mastercard', creditLimit: 15000},
          {cardId: '3', cardBrand: 'American Express', creditLimit: 20000},
          {cardId: '4', cardBrand: 'Discover', creditLimit: 5000}
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result.length).toBe(4);
        var brands = result.map(function(card) { return card.cardBrand; });
        expect(brands).toContain('Visa');
        expect(brands).toContain('Mastercard');
        expect(brands).toContain('American Express');
        expect(brands).toContain('Discover');
      });

      it('should handle timeout error', function() {
        $httpBackend.expectGET('/api/cards').respond(408, 'Request Timeout');

        var error;
        CreditCardService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(408);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards
  - Scenarios covered:
    * Successful retrieval of multiple credit cards
    * Empty cards array handling
    * Server error (500) handling
    * Network error (status 0) handling
    * Unauthorized access (401) handling
    * Validation of required card fields
    * Zero credit limit scenario
    * Maximum credit utilization scenario
    * Multiple card brands support
    * Request timeout (408) handling
  - Edge cases: Empty data, various HTTP errors, zero values, maximum utilization
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();