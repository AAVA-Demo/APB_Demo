/*
Test Documentation:
- Test Name: CreditCardService - getCards success scenario
- Purpose: Validates that getCards successfully retrieves card data from API
- Scenario: HTTP GET request returns successful response with card data
- Expected Result: Promise resolves with card data array
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Promise rejects with error and logs error to console
*/
/*
Test Documentation:
- Test Name: CreditCardService - getMockCards success scenario
- Purpose: Validates that getMockCards returns mock card data
- Scenario: getMockCards is called without parameters
- Expected Result: Promise resolves with array of 5 mock credit cards with complete data
*/
/*
Coverage Report:
- Functions tested: getCards (success/error), getMockCards
- Scenarios covered: successful API call, failed API call, network error, mock data retrieval, data validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCards', function() {
      it('should successfully retrieve cards from API', function() {
        var mockCards = [
          {cardId: 'C001', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 10000},
          {cardId: 'C002', cardNumber: '**** 5678', cardType: 'Mastercard', creditLimit: 15000}
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
        expect(result[1].cardId).toBe('C002');
      });

      it('should handle error when API call fails', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(500, 'Internal Server Error');

        var errorResult;
        CreditCardService.getCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
      });

      it('should handle 401 unauthorized error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(401, 'Unauthorized');

        var errorResult;
        CreditCardService.getCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network timeout', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(-1, '');

        var errorResult;
        CreditCardService.getCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getMockCards', function() {
      it('should return array of 5 mock credit cards', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(5);
      });

      it('should return cards with all required properties', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card).toEqual(jasmine.objectContaining({
            cardId: jasmine.any(String),
            cardNumber: jasmine.any(String),
            cardType: jasmine.any(String),
            issuer: jasmine.any(String),
            issuerLogo: jasmine.any(String),
            creditLimit: jasmine.any(Number),
            outstandingAmount: jasmine.any(Number),
            availableCredit: jasmine.any(Number),
            expiryDate: jasmine.any(String),
            status: jasmine.any(String)
          }));
        });
      });

      it('should return cards with correct sequential IDs', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        expect(result[0].cardId).toBe('C001');
        expect(result[1].cardId).toBe('C002');
        expect(result[2].cardId).toBe('C003');
        expect(result[3].cardId).toBe('C004');
        expect(result[4].cardId).toBe('C005');
      });

      it('should return cards with valid financial data', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.creditLimit).toBeGreaterThan(0);
          expect(card.availableCredit).toBeGreaterThanOrEqual(0);
          expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
          expect(card.creditLimit).toBe(card.availableCredit + card.outstandingAmount);
        });
      });

      it('should return cards with masked card numbers', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.cardNumber).toContain('****');
          expect(card.cardNumber.length).toBeGreaterThan(10);
        });
      });

      it('should return cards with different card types', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        var cardTypes = result.map(function(card) { return card.cardType; });
        expect(cardTypes).toContain('Visa');
        expect(cardTypes).toContain('Mastercard');
        expect(cardTypes).toContain('Amex');
        expect(cardTypes).toContain('Discover');
      });

      it('should return cards with Active status', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.status).toBe('Active');
        });
      });

      it('should return cards with valid expiry dates', function() {
        var result;
        CreditCardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.expiryDate).toMatch(/\d{4}-\d{2}-\d{2}/);
          var expiryDate = new Date(card.expiryDate);
          var today = new Date();
          expect(expiryDate.getTime()).toBeGreaterThan(today.getTime());
        });
      });
    });
  });
})();