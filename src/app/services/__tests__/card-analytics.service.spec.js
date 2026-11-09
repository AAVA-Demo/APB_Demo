/*
Test Documentation:
- Test Name: CardAnalyticsService Unit Tests
- Purpose: Validate card analysis calculations including available credit and utilization rate
- Scenario: Test analyzeCard method with various card data
- Expected Result: Accurate calculation of available credit and utilization rate
*/

describe('CardAnalyticsService', function() {
  'use strict';
  
  var CardAnalyticsService;
  
  beforeEach(module('cardManagementModule'));
  
  beforeEach(inject(function(_CardAnalyticsService_) {
    CardAnalyticsService = _CardAnalyticsService_;
  }));
  
  describe('analyzeCard', function() {
    it('should calculate available credit correctly', function() {
      var card = {
        cardId: 'card1',
        creditLimit: 5000,
        outstandingBalance: 1500
      };
      
      var result = CardAnalyticsService.analyzeCard(card);
      
      expect(result.availableCredit).toBe(3500);
    });
    
    it('should calculate utilization rate correctly', function() {
      var card = {
        cardId: 'card2',
        creditLimit: 10000,
        outstandingBalance: 2500
      };
      
      var result = CardAnalyticsService.analyzeCard(card);
      
      expect(result.utilizationRate).toBe(25);
    });
    
    it('should handle zero outstanding balance', function() {
      var card = {
        cardId: 'card3',
        creditLimit: 15000,
        outstandingBalance: 0
      };
      
      var result = CardAnalyticsService.analyzeCard(card);
      
      expect(result.availableCredit).toBe(15000);
      expect(result.utilizationRate).toBe(0);
    });
    
    it('should handle full utilization', function() {
      var card = {
        cardId: 'card4',
        creditLimit: 8000,
        outstandingBalance: 8000
      };
      
      var result = CardAnalyticsService.analyzeCard(card);
      
      expect(result.availableCredit).toBe(0);
      expect(result.utilizationRate).toBe(100);
    });
    
    it('should preserve original card properties', function() {
      var card = {
        cardId: 'card5',
        cardNumber: '****1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1000
      };
      
      var result = CardAnalyticsService.analyzeCard(card);
      
      expect(result.cardId).toBe('card5');
      expect(result.cardNumber).toBe('****1234');
      expect(result.cardType).toBe('Visa');
    });
  });
});

/*
Coverage Report:
- Functions tested: analyzeCard
- Scenarios covered:
  * Available credit calculation
  * Utilization rate calculation
  * Zero balance handling
  * Full utilization handling
  * Property preservation
- Uncovered scenarios: None
*/