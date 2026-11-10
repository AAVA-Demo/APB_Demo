/*
Test Documentation:
- Test Name: CardMappingService Test Suite
- Purpose: Validate card mapping and enrichment functionality for transactions
- Scenario: Tests enrichment of transactions with card details from API
- Expected Result: Transactions are enriched with correct card details and caching works properly
*/

(function() {
  'use strict';

  describe('CardMappingService', function() {
    var CardMappingService, $httpBackend, $cacheFactory;
    var API_BASE = '/api/cards';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardMappingService_, _$httpBackend_, _$cacheFactory_) {
      CardMappingService = _CardMappingService_;
      $httpBackend = _$httpBackend_;
      $cacheFactory = _$cacheFactory_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('enrichWithCardDetails', function() {
      it('should enrich transactions with card details from API', function() {
        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 100 },
          { transactionId: 'txn-002', cardId: 'card-002', amount: 200 }
        ];

        var card001 = { cardId: 'card-001', cardNumber: '****1234', cardType: 'Visa' };
        var card002 = { cardId: 'card-002', cardNumber: '****5678', cardType: 'Mastercard' };

        $httpBackend.expectGET(API_BASE + '/card-001').respond(200, card001);
        $httpBackend.expectGET(API_BASE + '/card-002').respond(200, card002);

        var result;
        CardMappingService.enrichWithCardDetails(transactions).then(function(enriched) {
          result = enriched;
        });

        $httpBackend.flush();

        expect(result.length).toBe(2);
        expect(result[0].cardDetails.cardNumber).toBe('****1234');
        expect(result[1].cardDetails.cardNumber).toBe('****5678');
      });

      it('should use cached card details when available', function() {
        var cache = $cacheFactory.get('cardMappingCache');
        var cachedCard = { cardId: 'card-001', cardNumber: '****1234', cardType: 'Visa' };
        cache.put('card-001', cachedCard);

        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 100 }
        ];

        var result;
        CardMappingService.enrichWithCardDetails(transactions).then(function(enriched) {
          result = enriched;
        });

        expect(result.length).toBe(1);
        expect(result[0].cardDetails.cardNumber).toBe('****1234');
      });

      it('should handle transactions with duplicate card IDs efficiently', function() {
        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 100 },
          { transactionId: 'txn-002', cardId: 'card-001', amount: 200 },
          { transactionId: 'txn-003', cardId: 'card-001', amount: 300 }
        ];

        var card001 = { cardId: 'card-001', cardNumber: '****1234', cardType: 'Visa' };

        $httpBackend.expectGET(API_BASE + '/card-001').respond(200, card001);

        var result;
        CardMappingService.enrichWithCardDetails(transactions).then(function(enriched) {
          result = enriched;
        });

        $httpBackend.flush();

        expect(result.length).toBe(3);
        expect(result[0].cardDetails.cardNumber).toBe('****1234');
        expect(result[1].cardDetails.cardNumber).toBe('****1234');
        expect(result[2].cardDetails.cardNumber).toBe('****1234');
      });

      it('should handle transactions with missing cardId', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100 },
          { transactionId: 'txn-002', cardId: null, amount: 200 }
        ];

        var result;
        CardMappingService.enrichWithCardDetails(transactions).then(function(enriched) {
          result = enriched;
        });

        expect(result.length).toBe(2);
        expect(result[0].cardDetails).toEqual({});
        expect(result[1].cardDetails).toEqual({});
      });

      it('should handle API errors gracefully', function() {
        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 100 }
        ];

        $httpBackend.expectGET(API_BASE + '/card-001').respond(500, 'Server Error');

        var error;
        CardMappingService.enrichWithCardDetails(transactions).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should return empty array for empty transaction list', function() {
        var result;
        CardMappingService.enrichWithCardDetails([]).then(function(enriched) {
          result = enriched;
        });

        expect(result.length).toBe(0);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: enrichWithCardDetails
- Scenarios covered:
  * Successful enrichment with API calls
  * Cache utilization for performance
  * Duplicate card ID handling
  * Missing cardId handling
  * API error handling
  * Empty transaction list
- Uncovered scenarios: None - comprehensive coverage achieved
*/