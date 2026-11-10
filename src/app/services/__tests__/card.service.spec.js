/*
Test Documentation:
- Test Name: CardService - getCards success scenario
- Purpose: Validates that getCards successfully retrieves card data from API
- Scenario: HTTP GET request returns successful response with card data
- Expected Result: Promise resolves with card data array
*/
/*
Test Documentation:
- Test Name: CardService - getCards error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Promise rejects with error and logs error to console
*/
/*
Test Documentation:
- Test Name: CardService - getMockCards success scenario
- Purpose: Validates that getMockCards returns mock card data
- Scenario: getMockCards is called without parameters
- Expected Result: Promise resolves with array of 5 mock credit cards
*/
/*
Coverage Report:
- Functions tested: getCards (success/error), getMockCards
- Scenarios covered: successful API call, failed API call, mock data retrieval, data structure validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardService', function() {
    var CardService, $httpBackend, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_) {
      CardService = _CardService_;
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
          {cardId: 'C001', cardNumber: '**** 1234', cardType: 'Visa'},
          {cardId: 'C002', cardNumber: '**** 5678', cardType: 'Mastercard'}
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CardService.getCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
      });

      it('should handle error when API call fails', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(500, 'Internal Server Error');

        var errorResult;
        CardService.getCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
      });

      it('should handle network error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(0, '');

        var errorResult;
        CardService.getCards().catch(function(error) {
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
        CardService.getMockCards().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(5);
      });

      it('should return cards with required properties', function() {
        var result;
        CardService.getMockCards().then(function(data) {
          result = data;
        });

        expect(result[0]).toEqual(jasmine.objectContaining({
          cardId: jasmine.any(String),
          cardNumber: jasmine.any(String),
          cardType: jasmine.any(String),
          issuer: jasmine.any(String),
          creditLimit: jasmine.any(Number),
          outstandingAmount: jasmine.any(Number),
          availableCredit: jasmine.any(Number),
          expiryDate: jasmine.any(String),
          status: jasmine.any(String)
        }));
      });

      it('should return cards with correct cardIds', function() {
        var result;
        CardService.getMockCards().then(function(data) {
          result = data;
        });

        expect(result[0].cardId).toBe('C001');
        expect(result[1].cardId).toBe('C002');
        expect(result[2].cardId).toBe('C003');
        expect(result[3].cardId).toBe('C004');
        expect(result[4].cardId).toBe('C005');
      });

      it('should return cards with valid credit limits', function() {
        var result;
        CardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.creditLimit).toBeGreaterThan(0);
          expect(card.availableCredit).toBeGreaterThanOrEqual(0);
          expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
          expect(card.creditLimit).toBe(card.availableCredit + card.outstandingAmount);
        });
      });

      it('should return cards with Active status', function() {
        var result;
        CardService.getMockCards().then(function(data) {
          result = data;
        });

        result.forEach(function(card) {
          expect(card.status).toBe('Active');
        });
      });
    });
  });
})();