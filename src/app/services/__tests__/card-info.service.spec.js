/*
Test Documentation:
- Test Name: CardInfoService Unit Tests
- Purpose: Validate card details retrieval with API and mock data fallback
- Scenario: Tests getCardDetails with successful API response, API failure, and various card IDs
- Expected Result: Correct card data returned, proper fallback to mock data on errors
*/

(function() {
  'use strict';

  describe('CardInfoService', function() {
    var CardInfoService, $httpBackend, API_ENDPOINTS;
    var mockCardResponse;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardInfoService_, _$httpBackend_, _API_ENDPOINTS_) {
      CardInfoService = _CardInfoService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;

      mockCardResponse = {
        cardId: 'card1',
        cardNumber: '**** **** **** 1234',
        cardType: 'Visa',
        creditLimit: 50000,
        currentBalance: 12500,
        availableCredit: 37500,
        monthlySpend: 8500,
        lastTransactionDate: new Date('2026-11-08'),
        cardHolderName: 'John Doe'
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardDetails', function() {
      it('should fetch card details from API successfully', function() {
        var cardId = 'card1';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(200, mockCardResponse);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCardResponse);
        expect(result.cardId).toBe('card1');
        expect(result.cardType).toBe('Visa');
        expect(result.creditLimit).toBe(50000);
      });

      it('should return mock data when API call fails', function() {
        var cardId = 'card2';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(500, 'Server Error');

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('card2');
        expect(result.cardType).toBe('MasterCard');
        expect(result.cardNumber).toBe('**** **** **** 5678');
      });

      it('should return mock data for card3 when API fails', function() {
        var cardId = 'card3';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(404, 'Not Found');

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe('card3');
        expect(result.cardType).toBe('Amex');
        expect(result.creditLimit).toBe(75000);
      });

      it('should return mock data for card4', function() {
        var cardId = 'card4';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(500);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe('card4');
        expect(result.cardNumber).toBe('**** **** **** 3456');
        expect(result.availableCredit).toBe(42000);
      });

      it('should return mock data for card5', function() {
        var cardId = 'card5';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(503);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe('card5');
        expect(result.cardType).toBe('MasterCard');
        expect(result.monthlySpend).toBe(11000);
      });

      it('should fallback to card1 mock data for unknown card ID', function() {
        var cardId = 'unknownCard';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(404);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe('card1');
        expect(result.cardType).toBe('Visa');
      });

      it('should handle network timeout gracefully', function() {
        var cardId = 'card2';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(0, '');

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('card2');
      });

      it('should return card with masked card number', function() {
        var cardId = 'card1';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(500);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toContain('****');
        expect(result.cardNumber).not.toContain('1234567890');
      });

      it('should include all required card fields in mock data', function() {
        var cardId = 'card1';
        $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(500);

        var result;
        CardInfoService.getCardDetails(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardId).toBeDefined();
        expect(result.cardNumber).toBeDefined();
        expect(result.cardType).toBeDefined();
        expect(result.creditLimit).toBeDefined();
        expect(result.currentBalance).toBeDefined();
        expect(result.availableCredit).toBeDefined();
        expect(result.monthlySpend).toBeDefined();
        expect(result.lastTransactionDate).toBeDefined();
        expect(result.cardHolderName).toBeDefined();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCardDetails
  - Scenarios covered:
    * Successful API response
    * API failure with mock data fallback (500, 404, 503, 0 errors)
    * All 5 mock cards (card1-card5)
    * Unknown card ID fallback
    * Network timeout handling
    * Masked card number validation
    * Required field presence
  - Edge cases: Unknown card IDs, various HTTP error codes, network failures
  - Uncovered scenarios: Card data validation, concurrent requests, cache behavior
  */
})();