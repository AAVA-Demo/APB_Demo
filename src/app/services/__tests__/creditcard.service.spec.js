/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate credit card service functionality including card retrieval, caching, and error handling
- Scenario: Tests cover successful card fetch, cache behavior, cache clearing, and error scenarios
- Expected Result: Credit cards should be retrieved correctly with proper caching and error handling
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, API_CONFIG, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_CONFIG_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      CreditCardService.clearCache();
    });

    describe('getCards', function() {
      it('should fetch credit cards from API successfully', function(done) {
        var mockCards = [
          { cardId: '1', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 5000, outstandingAmount: 1500, availableCredit: 3500 },
          { cardId: '2', cardNumber: '**** 5678', cardType: 'Mastercard', creditLimit: 10000, outstandingAmount: 2000, availableCredit: 8000 }
        ];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(200, mockCards);

        CreditCardService.getCards().then(function(cards) {
          expect(cards).toEqual(mockCards);
          expect(cards.length).toBe(2);
          expect(cards[0].cardType).toBe('Visa');
          done();
        });

        $httpBackend.flush();
      });

      it('should return cached cards on subsequent calls', function(done) {
        var mockCards = [
          { cardId: '1', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 5000 }
        ];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(200, mockCards);

        CreditCardService.getCards().then(function(firstCall) {
          expect(firstCall).toEqual(mockCards);

          CreditCardService.getCards().then(function(secondCall) {
            expect(secondCall).toEqual(mockCards);
            expect(secondCall).toBe(firstCall);
            done();
          });
        });

        $httpBackend.flush();
      });

      it('should handle API error and reject promise', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(500, { error: 'Internal server error' });

        CreditCardService.getCards().catch(function(error) {
          expect(error.status).toBe(500);
          expect(error.data.error).toBe('Internal server error');
          done();
        });

        $httpBackend.flush();
      });

      it('should handle 404 error when cards not found', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(404, { error: 'Cards not found' });

        CreditCardService.getCards().catch(function(error) {
          expect(error.status).toBe(404);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network timeout', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(0, '');

        CreditCardService.getCards().catch(function(error) {
          expect(error.status).toBe(0);
          done();
        });

        $httpBackend.flush();
      });

      it('should return empty array when no cards exist', function(done) {
        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(200, []);

        CreditCardService.getCards().then(function(cards) {
          expect(cards).toEqual([]);
          expect(cards.length).toBe(0);
          done();
        });

        $httpBackend.flush();
      });
    });

    describe('clearCache', function() {
      it('should clear cached cards and fetch fresh data on next call', function(done) {
        var initialCards = [
          { cardId: '1', cardNumber: '**** 1234', cardType: 'Visa' }
        ];
        var updatedCards = [
          { cardId: '1', cardNumber: '**** 1234', cardType: 'Visa' },
          { cardId: '2', cardNumber: '**** 5678', cardType: 'Mastercard' }
        ];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .respond(200, initialCards);

        CreditCardService.getCards().then(function(firstCall) {
          expect(firstCall.length).toBe(1);

          CreditCardService.clearCache();

          $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
            .respond(200, updatedCards);

          CreditCardService.getCards().then(function(secondCall) {
            expect(secondCall.length).toBe(2);
            done();
          });

          $httpBackend.flush();
        });

        $httpBackend.flush();
      });

      it('should not throw error when clearing empty cache', function() {
        expect(function() {
          CreditCardService.clearCache();
        }).not.toThrow();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getCards, clearCache
- Scenarios covered:
  * Successful API call with card retrieval
  * Cache hit on subsequent calls
  * API error handling (500, 404)
  * Network timeout handling
  * Empty card list handling
  * Cache clearing and fresh data fetch
  * Clearing empty cache
- Uncovered scenarios: Real-time card updates, card modification (out of scope)
- Edge cases tested: Network failures, server errors, empty responses, cache invalidation
*/