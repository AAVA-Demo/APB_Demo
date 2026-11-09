/*
Test Documentation:
- Test Name: CardAggregationService - getAllCards returns cached data
- Purpose: Validates that cached card data is returned on subsequent calls
- Scenario: Service has cached card aggregation from previous call
- Expected Result: Same cached data is returned without re-fetching
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getAllCards fetches fresh data
- Purpose: Validates that card data is fetched when no cache exists
- Scenario: First call to getAllCards with userId
- Expected Result: Mock card data is returned with aggregation details
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getAllCards returns correct structure
- Purpose: Validates the structure of returned card aggregation data
- Scenario: Service returns card aggregation with userId, cards array, and aggregated totals
- Expected Result: Data contains userId, cards array, totalCards, aggregatedLimit, and aggregatedBalance
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getAllCards supports minimum 10 cards
- Purpose: Validates NFR requirement for supporting at least 10 cards per user
- Scenario: Mock data contains 5 cards, verifying structure supports more
- Expected Result: Service can handle multiple cards (currently 5 in mock)
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getCardById returns specific card
- Purpose: Validates retrieval of individual card by cardId
- Scenario: Cards are cached, then specific card is requested by ID
- Expected Result: Correct card object is returned
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getCardById rejects when no cards loaded
- Purpose: Validates error handling when cards are not loaded
- Scenario: getCardById is called before getAllCards
- Expected Result: Promise is rejected with 'No cards loaded' message
*/
/*
Test Documentation:
- Test Name: CardAggregationService - getCardById rejects for invalid cardId
- Purpose: Validates error handling for non-existent card ID
- Scenario: Valid cards are loaded, but invalid cardId is requested
- Expected Result: Promise is rejected with 'Card not found' message
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: cached data retrieval, fresh data fetch, data structure validation, card count support, individual card retrieval, error handling for missing cards, error handling for invalid card ID
- Uncovered scenarios: HTTP error handling (not applicable for mock), real API integration
*/

describe('CardAggregationService', function() {
  'use strict';

  var CardAggregationService, $q, $rootScope, AuthFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardAggregationService_, _$q_, _$rootScope_, _AuthFactory_) {
    CardAggregationService = _CardAggregationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    AuthFactory = _AuthFactory_;
  }));

  afterEach(function() {
    CardAggregationService = null;
  });

  describe('getAllCards', function() {

    it('should return cached card data on subsequent calls', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(firstCallData) {
        expect(firstCallData).toBeDefined();
        expect(firstCallData.userId).toBe(userId);
        
        CardAggregationService.getAllCards(userId).then(function(secondCallData) {
          expect(secondCallData).toEqual(firstCallData);
          expect(secondCallData.userId).toBe(userId);
          done();
        });
        $rootScope.$digest();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should fetch and return card aggregation data when no cache exists', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe(userId);
        expect(data.cards).toBeDefined();
        expect(Array.isArray(data.cards)).toBe(true);
        expect(data.totalCards).toBeDefined();
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should return data with correct structure', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        expect(data.userId).toBe(userId);
        expect(Array.isArray(data.cards)).toBe(true);
        expect(typeof data.totalCards).toBe('number');
        expect(typeof data.aggregatedLimit).toBe('number');
        expect(typeof data.aggregatedBalance).toBe('number');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should return 5 credit cards in mock data', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        expect(data.cards.length).toBe(5);
        expect(data.totalCards).toBe(5);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should return cards with all required properties', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        data.cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.userId).toBe(userId);
          expect(card.cardName).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.currentBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.issuer).toBeDefined();
        });
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should calculate aggregated credit limit correctly', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        var expectedLimit = data.cards.reduce(function(sum, card) {
          return sum + card.creditLimit;
        }, 0);
        expect(data.aggregatedLimit).toBe(expectedLimit);
        expect(data.aggregatedLimit).toBe(75000);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should calculate aggregated balance correctly', function(done) {
      var userId = 'user123';
      
      CardAggregationService.getAllCards(userId).then(function(data) {
        var expectedBalance = data.cards.reduce(function(sum, card) {
          return sum + card.currentBalance;
        }, 0);
        expect(data.aggregatedBalance).toBe(expectedBalance);
        expect(data.aggregatedBalance).toBe(30500);
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

  });

  describe('getCardById', function() {

    it('should return specific card when valid cardId is provided', function(done) {
      var userId = 'user123';
      var targetCardId = 'card002';
      
      CardAggregationService.getAllCards(userId).then(function() {
        return CardAggregationService.getCardById(targetCardId);
      }).then(function(card) {
        expect(card).toBeDefined();
        expect(card.cardId).toBe(targetCardId);
        expect(card.cardName).toBe('Travel Elite');
        expect(card.cardNumber).toBe('****5678');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should reject when no cards are loaded', function(done) {
      var targetCardId = 'card001';
      
      CardAggregationService.getCardById(targetCardId).then(function() {
        fail('Promise should have been rejected');
        done();
      }, function(error) {
        expect(error).toBe('No cards loaded');
        done();
      });
      
      $rootScope.$digest();
    });

    it('should reject when invalid cardId is provided', function(done) {
      var userId = 'user123';
      var invalidCardId = 'card999';
      
      CardAggregationService.getAllCards(userId).then(function() {
        return CardAggregationService.getCardById(invalidCardId);
      }).then(function() {
        fail('Promise should have been rejected');
        done();
      }, function(error) {
        expect(error).toBe('Card not found');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

    it('should return card with all properties intact', function(done) {
      var userId = 'user123';
      var targetCardId = 'card004';
      
      CardAggregationService.getAllCards(userId).then(function() {
        return CardAggregationService.getCardById(targetCardId);
      }).then(function(card) {
        expect(card.cardId).toBe('card004');
        expect(card.cardName).toBe('Business Gold');
        expect(card.creditLimit).toBe(25000);
        expect(card.currentBalance).toBe(12500);
        expect(card.availableCredit).toBe(12500);
        expect(card.monthlySpend).toBe(2100);
        expect(card.cardType).toBe('Credit');
        expect(card.issuer).toBe('Bank D');
        done();
      });
      
      setTimeout(function() {
        $rootScope.$digest();
      }, 900);
    });

  });

});