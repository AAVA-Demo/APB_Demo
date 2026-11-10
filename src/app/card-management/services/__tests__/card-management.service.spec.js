/*
Test Documentation:
- Test Name: cardManagementService - getUserCards
- Purpose: Validates that getUserCards retrieves all cards for the authenticated user
- Scenario: When getUserCards is called, it should authenticate and return user's cards
- Expected Result: Returns a promise that resolves with an array of card objects
*/
/*
Test Documentation:
- Test Name: cardManagementService - getCardById
- Purpose: Validates that getCardById retrieves a specific card by its ID
- Scenario: When getCardById is called with a valid cardId, it should return the matching card
- Expected Result: Returns a promise that resolves with the card object or undefined
*/
/*
Coverage Report:
- Functions tested: getUserCards, getCardById
- Scenarios covered: successful card retrieval, authentication flow, card lookup by ID, invalid card ID
- Edge cases: authentication token retrieval, promise resolution, invalid cardId
- Uncovered scenarios: authentication failure (not implemented in mock)
*/

describe('cardManagementService', function() {
  'use strict';
  
  beforeEach(module('cardManagementModule'));
  beforeEach(module('creditCardApp'));
  
  var cardManagementService;
  var authService;
  var mockDataService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_cardManagementService_, _authService_, _mockDataService_, _$q_, _$rootScope_) {
    cardManagementService = _cardManagementService_;
    authService = _authService_;
    mockDataService = _mockDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getUserCards', function() {
    it('should be defined', function() {
      expect(cardManagementService.getUserCards).toBeDefined();
      expect(typeof cardManagementService.getUserCards).toBe('function');
    });
    
    it('should return a promise', function() {
      var result = cardManagementService.getUserCards();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should call authService.getAuthToken', function(done) {
      spyOn(authService, 'getAuthToken').and.callThrough();
      cardManagementService.getUserCards().then(function() {
        expect(authService.getAuthToken).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should resolve with array of cards', function(done) {
      cardManagementService.getUserCards().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBe(3);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return cards with required properties', function(done) {
      cardManagementService.getUserCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.totalLimit).toBeDefined();
          expect(card.outstandingBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should call mockDataService.getCards', function(done) {
      spyOn(mockDataService, 'getCards').and.callThrough();
      cardManagementService.getUserCards().then(function() {
        expect(mockDataService.getCards).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('getCardById', function() {
    it('should be defined', function() {
      expect(cardManagementService.getCardById).toBeDefined();
      expect(typeof cardManagementService.getCardById).toBe('function');
    });
    
    it('should return a promise', function() {
      var result = cardManagementService.getCardById('card001');
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should call authService.getAuthToken', function(done) {
      spyOn(authService, 'getAuthToken').and.callThrough();
      cardManagementService.getCardById('card001').then(function() {
        expect(authService.getAuthToken).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should resolve with correct card for valid cardId', function(done) {
      cardManagementService.getCardById('card001').then(function(card) {
        expect(card).toBeDefined();
        expect(card.cardId).toBe('card001');
        expect(card.cardName).toBe('Visa Platinum');
        done();
      });
      $rootScope.$digest();
    });
    
    it('should resolve with undefined for invalid cardId', function(done) {
      cardManagementService.getCardById('invalid-id').then(function(card) {
        expect(card).toBeUndefined();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should call mockDataService.getCardById with cardId', function(done) {
      spyOn(mockDataService, 'getCardById').and.callThrough();
      cardManagementService.getCardById('card002').then(function() {
        expect(mockDataService.getCardById).toHaveBeenCalledWith('card002');
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return card with all properties for card002', function(done) {
      cardManagementService.getCardById('card002').then(function(card) {
        expect(card.cardId).toBe('card002');
        expect(card.cardNumber).toBe('**** **** **** 5678');
        expect(card.cardType).toBe('MasterCard');
        expect(card.cardName).toBe('MasterCard Gold');
        expect(card.totalLimit).toBe(30000);
        expect(card.availableCredit).toBe(22000);
        expect(card.outstandingBalance).toBe(8000);
        expect(card.monthlySpend).toBe(4200);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return card with all properties for card003', function(done) {
      cardManagementService.getCardById('card003').then(function(card) {
        expect(card.cardId).toBe('card003');
        expect(card.cardType).toBe('Amex');
        expect(card.cardName).toBe('American Express');
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('service dependencies', function() {
    it('should have authService injected', function() {
      expect(authService).toBeDefined();
    });
    
    it('should have mockDataService injected', function() {
      expect(mockDataService).toBeDefined();
    });
  });
});