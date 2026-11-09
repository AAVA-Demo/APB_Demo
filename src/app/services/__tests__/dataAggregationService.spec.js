/*
Test Documentation:
- Test Name: dataAggregationService - consolidateKPIs
- Purpose: Validates KPI data consolidation
- Scenario: Service consolidates metrics into unified KPI structure
- Expected Result: Returns consolidated KPI object with all metrics and timestamp
*/
/*
Coverage Report:
- Functions tested: consolidateKPIs
- Scenarios covered: complete metrics, partial metrics, empty metrics, timestamp generation
- Uncovered scenarios: none
*/

describe('dataAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var dataAggregationService;
  
  beforeEach(inject(function(_dataAggregationService_) {
    dataAggregationService = _dataAggregationService_;
  }));
  
  describe('consolidateKPIs', function() {
    it('should consolidate complete metrics', function() {
      var metrics = {
        monthlySpend: 4500,
        totalCreditLimit: 23000,
        availableCredit: 18500,
        outstandingAmount: 4500,
        cards: [
          {cardId: 'card1', balance: 2500},
          {cardId: 'card2', balance: 2000}
        ]
      };
      
      var result = dataAggregationService.consolidateKPIs(metrics);
      
      expect(result.monthlySpend).toBe(4500);
      expect(result.totalCreditLimit).toBe(23000);
      expect(result.availableCredit).toBe(18500);
      expect(result.outstandingAmount).toBe(4500);
      expect(result.cards.length).toBe(2);
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
    
    it('should handle missing metrics with defaults', function() {
      var metrics = {};
      
      var result = dataAggregationService.consolidateKPIs(metrics);
      
      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.cards).toEqual([]);
      expect(result.lastUpdated).toBeDefined();
    });
    
    it('should handle partial metrics', function() {
      var metrics = {
        monthlySpend: 3000,
        totalCreditLimit: 15000
      };
      
      var result = dataAggregationService.consolidateKPIs(metrics);
      
      expect(result.monthlySpend).toBe(3000);
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
    });
    
    it('should generate current timestamp', function() {
      var metrics = {monthlySpend: 1000};
      var before = new Date();
      
      var result = dataAggregationService.consolidateKPIs(metrics);
      
      var after = new Date();
      expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime());
    });
    
    it('should preserve cards array', function() {
      var cards = [
        {cardId: 'card1', cardNumber: '**** 1234'},
        {cardId: 'card2', cardNumber: '**** 5678'},
        {cardId: 'card3', cardNumber: '**** 9012'}
      ];
      var metrics = {cards: cards};
      
      var result = dataAggregationService.consolidateKPIs(metrics);
      
      expect(result.cards).toBe(cards);
      expect(result.cards.length).toBe(3);
    });
  });
});