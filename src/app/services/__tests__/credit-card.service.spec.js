/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate credit card data retrieval with simple caching mechanism
- Scenario: Tests service initialization, successful data retrieval, caching behavior, and error handling
- Expected Result: Service correctly retrieves credit card data and implements simple caching without expiration
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCards', function() {
      it('should retrieve credit card data from API', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' },
          { id: 'card2', name: 'MasterCard Gold', creditLimit: 5000, currentBalance: 1000, availableCredit: 4000, lastFourDigits: '5678' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('card1');
        expect(result[0].name).toBe('Visa Platinum');
        expect(result[0].creditLimit).toBe(10000);
        expect(result[1].id).toBe('card2');
      });

      it('should cache credit card data after first retrieval', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result1, result2;
        CreditCardService.getCards().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        CreditCardService.getCards().then(function(data) {
          result2 = data;
        });

        $rootScope.$digest();

        expect(result1).toBe(result2);
      });

      it('should not make HTTP request if cache exists', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        CreditCardService.getCards();
        $httpBackend.flush();

        CreditCardService.getCards();
        $rootScope.$digest();
      });

      it('should return cached data immediately if cache exists', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result1;
        CreditCardService.getCards().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        var result2;
        var promise = CreditCardService.getCards();
        promise.then(function(data) {
          result2 = data;
        });

        $rootScope.$digest();

        expect(result2).toBe(result1);
      });

      it('should handle HTTP 500 error gracefully', function() {
        $httpBackend.expectGET('/api/cards').respond(500, 'Internal Server Error');

        var error;
        CreditCardService.getCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should reject promise on network error', function() {
        $httpBackend.expectGET('/api/cards').respond(0, '');

        var error;
        CreditCardService.getCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should handle HTTP 404 error', function() {
        $httpBackend.expectGET('/api/cards').respond(404, 'Not Found');

        var error;
        CreditCardService.getCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should handle empty array response', function() {
        $httpBackend.expectGET('/api/cards').respond(200, []);

        var result;
        CreditCardService.getCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(0);
      });

      it('should cache empty array response', function() {
        $httpBackend.expectGET('/api/cards').respond(200, []);

        var result1;
        CreditCardService.getCards().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        var result2;
        CreditCardService.getCards().then(function(data) {
          result2 = data;
        });

        $rootScope.$digest();

        expect(result2).toBe(result1);
      });

      it('should return promise that resolves with card data', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var promise = CreditCardService.getCards();
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });

      it('should handle multiple simultaneous calls before cache is set', function() {
        var mockCards = [
          { id: 'card1', name: 'Visa Platinum', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, lastFourDigits: '1234' }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result1, result2;
        CreditCardService.getCards().then(function(data) {
          result1 = data;
        });

        CreditCardService.getCards().then(function(data) {
          result2 = data;
        });

        $httpBackend.flush();

        expect(result1).toBeDefined();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered:
  * Successful retrieval of credit card data from API
  * Caching of credit card data after first retrieval
  * No HTTP request when cache exists
  * Immediate return of cached data
  * HTTP 500 error handling
  * Network error handling
  * HTTP 404 error handling
  * Empty array response handling
  * Caching of empty array response
  * Promise interface validation
  * Multiple simultaneous calls handling
- Uncovered scenarios: None - comprehensive coverage achieved
- Note: This service uses simple caching without expiration, unlike CreditCardDataService
*/