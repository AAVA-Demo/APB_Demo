/*
Test Documentation:
- Test Name: CreditCardDataService Test Suite
- Purpose: Validate credit card data retrieval functionality for single and multiple cards
- Scenario: Tests card data fetching via API with fallback to mock data on errors
- Expected Result: Service should retrieve card data or return mock data on failure
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService, ApiGatewayService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataService_, _ApiGatewayService_, _$rootScope_, _$q_) {
      CreditCardDataService = _CreditCardDataService_;
      ApiGatewayService = _ApiGatewayService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    describe('getCardData', function() {
      it('should call ApiGatewayService.get with correct endpoint', function() {
        var cardId = 'card-123';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        CreditCardDataService.getCardData(cardId);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/cards/' + cardId);
      });

      it('should return API data when request succeeds', function() {
        var cardId = 'card-456';
        var apiResponse = {
          cardId: cardId,
          cardNumber: '**** **** **** 5678',
          cardType: 'Mastercard',
          issuer: 'Citi Bank',
          brandingUrl: 'https://example.com/citi.png',
          creditLimit: 20000,
          availableCredit: 15000,
          outstandingAmount: 5000,
          userId: 'user-456'
        };

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        CreditCardDataService.getCardData(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data when API request fails', function() {
        var cardId = 'card-789';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 404 }));

        var result;
        CreditCardDataService.getCardData(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.cardType).toBe('Visa');
        expect(result.issuer).toBe('Chase Bank');
      });

      it('should include all required fields in mock data', function() {
        var cardId = 'card-mock';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getCardData(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.cardId).toBeDefined();
        expect(result.cardNumber).toBeDefined();
        expect(result.cardType).toBeDefined();
        expect(result.issuer).toBeDefined();
        expect(result.brandingUrl).toBeDefined();
        expect(result.creditLimit).toBeDefined();
        expect(result.availableCredit).toBeDefined();
        expect(result.outstandingAmount).toBeDefined();
        expect(result.userId).toBeDefined();
      });

      it('should generate random last 4 digits for mock card number', function() {
        var cardId = 'card-random';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getCardData(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.cardNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
      });
    });

    describe('getAllCards', function() {
      it('should call ApiGatewayService.get with correct endpoint and userId', function() {
        var userId = 'user-123';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        CreditCardDataService.getAllCards(userId);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/cards?userId=' + userId);
      });

      it('should return API data when request succeeds', function() {
        var userId = 'user-456';
        var apiResponse = [
          { cardId: 'card-1', cardNumber: '**** 1111', cardType: 'Visa' },
          { cardId: 'card-2', cardNumber: '**** 2222', cardType: 'Mastercard' }
        ];

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data array when API request fails', function() {
        var userId = 'user-789';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500 }));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
      });

      it('should generate 3 mock cards with correct properties', function() {
        var userId = 'user-mock';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.length).toBe(3);
        result.forEach(function(card, index) {
          expect(card.cardId).toBe('card-' + (index + 1));
          expect(card.userId).toBe(userId);
        });
      });

      it('should generate different card types for mock cards', function() {
        var userId = 'user-types';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result[0].cardType).toBe('Visa');
        expect(result[1].cardType).toBe('Mastercard');
        expect(result[2].cardType).toBe('Amex');
      });

      it('should generate different issuers for mock cards', function() {
        var userId = 'user-issuers';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result[0].issuer).toBe('Chase');
        expect(result[1].issuer).toBe('Citi');
        expect(result[2].issuer).toBe('American Express');
      });

      it('should generate increasing credit limits for mock cards', function() {
        var userId = 'user-limits';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result[0].creditLimit).toBe(20000);
        expect(result[1].creditLimit).toBe(25000);
        expect(result[2].creditLimit).toBe(30000);
      });

      it('should generate sequential card numbers for mock cards', function() {
        var userId = 'user-numbers';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result[0].cardNumber).toBe('**** **** **** 1001');
        expect(result[1].cardNumber).toBe('**** **** **** 1002');
        expect(result[2].cardNumber).toBe('**** **** **** 1003');
      });
    });

    describe('error handling', function() {
      it('should handle network errors for getCardData', function() {
        var cardId = 'card-network-error';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500 }));

        var result;
        CreditCardDataService.getCardData(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
      });

      it('should handle network errors for getAllCards', function() {
        var userId = 'user-network-error';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 503 }));

        var result;
        CreditCardDataService.getAllCards(userId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('promise handling', function() {
      it('should return promise from getCardData', function() {
        var cardId = 'card-promise';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = CreditCardDataService.getCardData(cardId);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should return promise from getAllCards', function() {
        var userId = 'user-promise';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = CreditCardDataService.getAllCards(userId);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCardData(), getAllCards()
- Scenarios covered:
  * API Gateway service invocation for single card
  * API Gateway service invocation for all cards
  * Successful API response handling
  * API failure with mock data fallback
  * All required fields in mock data
  * Random card number generation
  * Multiple mock cards generation (3 cards)
  * Different card types and issuers
  * Increasing credit limits
  * Sequential card numbers
  * Network error handling
  * Promise return validation
- Uncovered scenarios: Card data caching, pagination for large card lists, card data validation
*/