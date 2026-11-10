/*
Test Documentation:
- Test Name: CardService - getAllCards - success scenario
- Purpose: Validates that getAllCards retrieves all user cards and calculates utilization
- Scenario: Service fetches cards from API and computes utilization percentage
- Expected Result: Returns array of cards with utilizationPercent calculated
*/
/*
Test Documentation:
- Test Name: CardService - getAllCards - zero credit limit handling
- Purpose: Validates that utilization calculation handles zero credit limit
- Scenario: Card has zero credit limit to avoid division by zero
- Expected Result: utilizationPercent is set to 0 without errors
*/
/*
Test Documentation:
- Test Name: CardService - getCardById - success scenario
- Purpose: Validates that getCardById retrieves specific card details
- Scenario: Service fetches single card by ID and calculates utilization
- Expected Result: Returns card object with all properties including utilizationPercent
*/
/*
Test Documentation:
- Test Name: CardService - getCardSpendAnalysis - success scenario
- Purpose: Validates that getCardSpendAnalysis retrieves spending breakdown for a card
- Scenario: Service fetches spend analysis data from API
- Expected Result: Returns spend analysis object with category breakdown
*/
/*
Test Documentation:
- Test Name: CardService - error handling for all methods
- Purpose: Validates that all service methods handle API errors gracefully
- Scenario: HTTP requests fail with various error codes
- Expected Result: Promises are rejected and errors are logged
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById, getCardSpendAnalysis
- Scenarios covered: success paths, error handling, edge cases (zero credit limit, empty arrays)
- Uncovered scenarios: concurrent requests, rate limiting
*/

describe('CardService', function() {
  'use strict';
  
  beforeEach(module('app.cardManagement'));
  
  var CardService, $httpBackend, $q;
  var mockCards = [
    {
      cardId: 'card1',
      cardType: 'Visa',
      lastFourDigits: '1234',
      issuer: 'Chase',
      creditLimit: 5000,
      currentBalance: 2500,
      outstandingAmount: 2500
    },
    {
      cardId: 'card2',
      cardType: 'MasterCard',
      lastFourDigits: '5678',
      issuer: 'Citi',
      creditLimit: 10000,
      currentBalance: 3000,
      outstandingAmount: 3000
    }
  ];
  var mockCardDetail = {
    cardId: 'card1',
    cardType: 'Visa',
    lastFourDigits: '1234',
    issuer: 'Chase',
    creditLimit: 5000,
    currentBalance: 2500,
    outstandingAmount: 2500
  };
  var mockSpendAnalysis = {
    monthlySpend: 1500,
    transactionCount: 25,
    avgTransactionAmount: 60,
    spendByCategory: {
      'Food & Dining': 500,
      'Fuel': 300,
      'Shopping': 700
    }
  };
  
  beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    
    it('should retrieve all cards and calculate utilization percentage', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].utilizationPercent).toBe(50);
      expect(result[1].utilizationPercent).toBe(30);
    });
    
    it('should handle zero credit limit without division error', function() {
      var cardsWithZeroLimit = [{
        cardId: 'card3',
        cardType: 'Amex',
        creditLimit: 0,
        currentBalance: 0
      }];
      
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, cardsWithZeroLimit);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result[0].utilizationPercent).toBe(0);
    });
    
    it('should handle empty cards array', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, []);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle null response data', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, null);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(500, 'Internal Server Error');
      
      var error;
      CardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
  
  describe('getCardById', function() {
    
    it('should retrieve card by ID and calculate utilization', function() {
      $httpBackend.expectGET('/api/cards/card1')
        .respond(200, mockCardDetail);
      
      var result;
      CardService.getCardById('card1').then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card1');
      expect(result.utilizationPercent).toBe(50);
    });
    
    it('should handle card with zero credit limit', function() {
      var cardWithZeroLimit = {
        cardId: 'card3',
        creditLimit: 0,
        currentBalance: 0
      };
      
      $httpBackend.expectGET('/api/cards/card3')
        .respond(200, cardWithZeroLimit);
      
      var result;
      CardService.getCardById('card3').then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      
      expect(result.utilizationPercent).toBe(0);
    });
    
    it('should reject promise when card not found', function() {
      $httpBackend.expectGET('/api/cards/invalid')
        .respond(404, 'Card not found');
      
      var error;
      CardService.getCardById('invalid').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/cards/card1')
        .respond(500, 'Internal Server Error');
      
      var error;
      CardService.getCardById('card1').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
  
  describe('getCardSpendAnalysis', function() {
    
    it('should retrieve spend analysis for a card', function() {
      $httpBackend.expectGET('/api/cards/card1/spend-analysis')
        .respond(200, mockSpendAnalysis);
      
      var result;
      CardService.getCardSpendAnalysis('card1').then(function(analysis) {
        result = analysis;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(1500);
      expect(result.transactionCount).toBe(25);
      expect(result.spendByCategory['Food & Dining']).toBe(500);
    });
    
    it('should handle empty spend analysis', function() {
      var emptyAnalysis = {
        monthlySpend: 0,
        transactionCount: 0,
        avgTransactionAmount: 0,
        spendByCategory: {}
      };
      
      $httpBackend.expectGET('/api/cards/card1/spend-analysis')
        .respond(200, emptyAnalysis);
      
      var result;
      CardService.getCardSpendAnalysis('card1').then(function(analysis) {
        result = analysis;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.transactionCount).toBe(0);
    });
    
    it('should reject promise when analysis not found', function() {
      $httpBackend.expectGET('/api/cards/invalid/spend-analysis')
        .respond(404, 'Analysis not found');
      
      var error;
      CardService.getCardSpendAnalysis('invalid').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/cards/card1/spend-analysis')
        .respond(500, 'Internal Server Error');
      
      var error;
      CardService.getCardSpendAnalysis('card1').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});