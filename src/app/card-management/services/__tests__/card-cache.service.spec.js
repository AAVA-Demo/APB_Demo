/*
Test Documentation:
- Test Name: cardCache Service Unit Tests
- Purpose: Validates card caching service for storing and retrieving card data client-side
- Scenario: Tests store, getCard, getAllCards, and clear methods with various data scenarios
- Expected Result: Service should correctly cache and retrieve card data for instant switching
*/

describe('cardCache', function() {
  'use strict';

  var cardCache;
  var mockCards = [
    {cardId: 'card1', cardName: 'Card 1', creditLimit: 10000},
    {cardId: 'card2', cardName: 'Card 2', creditLimit: 15000},
    {cardId: 'card3', cardName: 'Card 3', creditLimit: 20000}
  ];

  beforeEach(module('creditCardApp.cardManagement'));

  beforeEach(inject(function(_cardCache_) {
    cardCache = _cardCache_;
  }));

  afterEach(function() {
    cardCache.clear();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(cardCache).toBeDefined();
    });

    it('should have store method', function() {
      expect(cardCache.store).toBeDefined();
      expect(typeof cardCache.store).toBe('function');
    });

    it('should have getCard method', function() {
      expect(cardCache.getCard).toBeDefined();
      expect(typeof cardCache.getCard).toBe('function');
    });

    it('should have getAllCards method', function() {
      expect(cardCache.getAllCards).toBeDefined();
      expect(typeof cardCache.getAllCards).toBe('function');
    });

    it('should have clear method', function() {
      expect(cardCache.clear).toBeDefined();
      expect(typeof cardCache.clear).toBe('function');
    });
  });

  describe('store() method', function() {
    it('should store array of cards', function() {
      cardCache.store(mockCards);
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual(mockCards);
    });

    it('should store individual cards by cardId', function() {
      cardCache.store(mockCards);
      var card1 = cardCache.getCard('card1');
      expect(card1).toEqual(mockCards[0]);
    });

    it('should store all cards individually', function() {
      cardCache.store(mockCards);
      mockCards.forEach(function(card) {
        var cachedCard = cardCache.getCard(card.cardId);
        expect(cachedCard).toEqual(card);
      });
    });

    it('should overwrite existing cards on re-store', function() {
      cardCache.store(mockCards);
      var updatedCards = [{cardId: 'card1', cardName: 'Updated Card 1', creditLimit: 25000}];
      cardCache.store(updatedCards);
      
      var card = cardCache.getCard('card1');
      expect(card.cardName).toBe('Updated Card 1');
      expect(card.creditLimit).toBe(25000);
    });

    it('should handle empty array', function() {
      cardCache.store([]);
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual([]);
    });
  });

  describe('getCard() method', function() {
    beforeEach(function() {
      cardCache.store(mockCards);
    });

    it('should retrieve card by cardId', function() {
      var card = cardCache.getCard('card1');
      expect(card).toBeDefined();
      expect(card.cardId).toBe('card1');
    });

    it('should return correct card data', function() {
      var card = cardCache.getCard('card2');
      expect(card.cardName).toBe('Card 2');
      expect(card.creditLimit).toBe(15000);
    });

    it('should return undefined for non-existent cardId', function() {
      var card = cardCache.getCard('nonexistent');
      expect(card).toBeUndefined();
    });

    it('should retrieve all stored cards individually', function() {
      var card1 = cardCache.getCard('card1');
      var card2 = cardCache.getCard('card2');
      var card3 = cardCache.getCard('card3');
      
      expect(card1).toBeDefined();
      expect(card2).toBeDefined();
      expect(card3).toBeDefined();
    });

    it('should return undefined when cache is empty', function() {
      cardCache.clear();
      var card = cardCache.getCard('card1');
      expect(card).toBeUndefined();
    });
  });

  describe('getAllCards() method', function() {
    it('should return empty array when no cards are stored', function() {
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual([]);
    });

    it('should return all stored cards', function() {
      cardCache.store(mockCards);
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual(mockCards);
    });

    it('should return array with correct length', function() {
      cardCache.store(mockCards);
      var allCards = cardCache.getAllCards();
      expect(allCards.length).toBe(3);
    });

    it('should return updated cards after re-store', function() {
      cardCache.store(mockCards);
      var newCards = [{cardId: 'card4', cardName: 'Card 4'}];
      cardCache.store(newCards);
      
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual(newCards);
    });
  });

  describe('clear() method', function() {
    beforeEach(function() {
      cardCache.store(mockCards);
    });

    it('should clear all stored cards', function() {
      cardCache.clear();
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual([]);
    });

    it('should clear individual card cache', function() {
      cardCache.clear();
      var card = cardCache.getCard('card1');
      expect(card).toBeUndefined();
    });

    it('should allow re-storing after clear', function() {
      cardCache.clear();
      cardCache.store(mockCards);
      var allCards = cardCache.getAllCards();
      expect(allCards).toEqual(mockCards);
    });
  });

  describe('Instant Card Switching Scenarios', function() {
    beforeEach(function() {
      cardCache.store(mockCards);
    });

    it('should enable instant switching between cards', function() {
      var card1 = cardCache.getCard('card1');
      var card2 = cardCache.getCard('card2');
      var card3 = cardCache.getCard('card3');
      
      expect(card1.cardId).toBe('card1');
      expect(card2.cardId).toBe('card2');
      expect(card3.cardId).toBe('card3');
    });

    it('should retrieve cards without delay', function() {
      var startTime = Date.now();
      cardCache.getCard('card1');
      var endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should support multiple rapid card retrievals', function() {
      for (var i = 0; i < 100; i++) {
        var card = cardCache.getCard('card1');
        expect(card).toBeDefined();
      }
    });
  });

  describe('Data Isolation', function() {
    it('should maintain separate cache entries for each card', function() {
      cardCache.store(mockCards);
      
      var card1 = cardCache.getCard('card1');
      var card2 = cardCache.getCard('card2');
      
      expect(card1.cardId).not.toBe(card2.cardId);
      expect(card1.creditLimit).not.toBe(card2.creditLimit);
    });

    it('should not affect other cards when updating one card', function() {
      cardCache.store(mockCards);
      
      var originalCard2 = cardCache.getCard('card2');
      var updatedCard1 = [{cardId: 'card1', cardName: 'Updated', creditLimit: 99999}];
      cardCache.store([updatedCard1[0], mockCards[1], mockCards[2]]);
      
      var card2AfterUpdate = cardCache.getCard('card2');
      expect(card2AfterUpdate).toEqual(originalCard2);
    });
  });

  describe('Edge Cases', function() {
    it('should handle null input gracefully', function() {
      expect(function() {
        cardCache.store(null);
      }).toThrow();
    });

    it('should handle undefined cardId in getCard', function() {
      cardCache.store(mockCards);
      var card = cardCache.getCard(undefined);
      expect(card).toBeUndefined();
    });

    it('should handle null cardId in getCard', function() {
      cardCache.store(mockCards);
      var card = cardCache.getCard(null);
      expect(card).toBeUndefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: store, getCard, getAllCards, clear
- Scenarios covered:
  * Storing and retrieving multiple cards
  * Individual card retrieval by ID
  * Retrieving all cards
  * Clearing cache
  * Instant card switching (NFR requirement)
  * Data isolation between cards
  * Overwriting existing cache
  * Empty cache handling
  * Edge cases (null/undefined inputs)
- Uncovered scenarios: Cache size limits, memory management
*/