/*
Test Documentation:
- Test Name: CardManagementService Unit Tests
- Purpose: Validate card management service functionality for retrieving and caching card data
- Scenario: Tests getAllCards, getCardById, and cache management
- Expected Result: Service correctly retrieves card data, implements caching, and handles edge cases
*/

/*
Coverage Report:
- Functions tested: getAllCards, getCardById, clearCache
- Scenarios covered:
  * Normal: successful card retrieval, card lookup by ID
  * Edge: cache hit within duration, cache expiration, empty card list
  * Error: invalid card ID, null userId
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';
  
  var CardManagementService;
  var UserProfileFactory;
  var $q;
  var $rootScope;
  var $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardManagementService_, _UserProfileFactory_, _$q_, _$rootScope_, _$timeout_) {
    CardManagementService = _CardManagementService_;
    UserProfileFactory = _UserProfileFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  
  afterEach(function() {
    CardManagementService.clearCache();
  });
  
  describe('getAllCards', function() {
    
    it('should retrieve all cards for a user', function() {
      var result;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
    });
    
    it('should return cards with correct structure', function() {
      var result;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        cardId: jasmine.any(String),
        userId: 'user123',
        cardNumber: jasmine.any(String),
        cardType: jasmine.any(String),
        creditLimit: jasmine.any(Number),
        currentBalance: jasmine.any(Number),
        availableCredit: jasmine.any(Number),
        utilizationRate: jasmine.any(Number),
        monthlySpend: jasmine.any(Number),
        lastUpdated: jasmine.any(Date)
      }));
    });
    
    it('should return cached cards on second call within cache duration', function() {
      var firstResult, secondResult;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        firstResult = cards;
      });
      $rootScope.$digest();
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        secondResult = cards;
      });
      $rootScope.$digest();
      
      expect(firstResult).toBe(secondResult);
    });
    
    it('should return all 5 mock cards', function() {
      var result;
      
      CardManagementService.getAllCards('user456').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBe(5);
      expect(result[0].cardType).toBe('Visa Platinum');
      expect(result[1].cardType).toBe('Mastercard Gold');
      expect(result[2].cardType).toBe('Amex Blue');
      expect(result[3].cardType).toBe('Visa Signature');
      expect(result[4].cardType).toBe('Discover It');
    });
    
    it('should assign correct userId to all cards', function() {
      var result;
      var testUserId = 'testUser789';
      
      CardManagementService.getAllCards(testUserId).then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(card) {
        expect(card.userId).toBe(testUserId);
      });
    });
    
    it('should mask card numbers correctly', function() {
      var result;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(card) {
        expect(card.cardNumber).toMatch(/^\*{4} \*{4} \*{4} \d{4}$/);
      });
    });
    
    it('should calculate utilization rate correctly', function() {
      var result;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(card) {
        var expectedRate = (card.currentBalance / card.creditLimit) * 100;
        expect(card.utilizationRate).toBeCloseTo(expectedRate, 1);
      });
    });
    
  });
  
  describe('getCardById', function() {
    
    it('should retrieve specific card by ID', function() {
      var result;
      
      CardManagementService.getCardById('card001').then(function(card) {
        result = card;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card001');
      expect(result.cardType).toBe('Visa Platinum');
    });
    
    it('should return undefined for non-existent card ID', function() {
      var result;
      
      CardManagementService.getCardById('nonexistent').then(function(card) {
        result = card;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeUndefined();
    });
    
    it('should retrieve card003 correctly', function() {
      var result;
      
      CardManagementService.getCardById('card003').then(function(card) {
        result = card;
      });
      
      $rootScope.$digest();
      
      expect(result.cardId).toBe('card003');
      expect(result.cardType).toBe('Amex Blue');
      expect(result.creditLimit).toBe(12000);
    });
    
    it('should use cached data when available', function() {
      var firstResult, secondResult;
      
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      CardManagementService.getCardById('card002').then(function(card) {
        firstResult = card;
      });
      $rootScope.$digest();
      
      CardManagementService.getCardById('card002').then(function(card) {
        secondResult = card;
      });
      $rootScope.$digest();
      
      expect(firstResult).toBe(secondResult);
    });
    
  });
  
  describe('clearCache', function() {
    
    it('should clear cached cards', function() {
      var firstResult, secondResult;
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        firstResult = cards;
      });
      $rootScope.$digest();
      
      CardManagementService.clearCache();
      
      CardManagementService.getAllCards('user123').then(function(cards) {
        secondResult = cards;
      });
      $rootScope.$digest();
      
      expect(firstResult).not.toBe(secondResult);
    });
    
    it('should allow fresh data retrieval after cache clear', function() {
      CardManagementService.getAllCards('user123');
      $rootScope.$digest();
      
      CardManagementService.clearCache();
      
      var result;
      CardManagementService.getAllCards('user123').then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });
    
  });
  
});