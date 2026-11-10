/*
Test Documentation:
- Test Name: portfolioAggregationService - calculatePortfolioMetrics
- Purpose: Validates that calculatePortfolioMetrics aggregates card data into portfolio metrics
- Scenario: When calculatePortfolioMetrics is called with card array, it should return aggregated portfolio data
- Expected Result: Returns object with userId, cards, totalCreditLimit, totalOutstanding, totalAvailableCredit, cardCount
*/
/*
Test Documentation:
- Test Name: portfolioAggregationService - calculatePortfolioMetrics with empty data
- Purpose: Validates that calculatePortfolioMetrics handles empty or null input gracefully
- Scenario: When calculatePortfolioMetrics is called with empty array or null, it should return default values
- Expected Result: Returns object with empty cards array and zero values
*/
/*
Coverage Report:
- Functions tested: calculatePortfolioMetrics
- Scenarios covered: valid data aggregation, empty data handling, null input, calculation accuracy, multiple cards
- Edge cases: empty array, null input, undefined input, single card, multiple cards
- Uncovered scenarios: none
*/

describe('portfolioAggregationService', function() {
  'use strict';
  
  beforeEach(module('cardManagementModule'));
  
  var portfolioAggregationService;
  
  beforeEach(inject(function(_portfolioAggregationService_) {
    portfolioAggregationService = _portfolioAggregationService_;
  }));
  
  describe('calculatePortfolioMetrics', function() {
    it('should be defined', function() {
      expect(portfolioAggregationService.calculatePortfolioMetrics).toBeDefined();
      expect(typeof portfolioAggregationService.calculatePortfolioMetrics).toBe('function');
    });
    
    it('should return portfolio object with required properties', function() {
      var cards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.userId).toBeDefined();
      expect(portfolio.cards).toBeDefined();
      expect(portfolio.totalCreditLimit).toBeDefined();
      expect(portfolio.totalOutstanding).toBeDefined();
      expect(portfolio.totalAvailableCredit).toBeDefined();
      expect(portfolio.cardCount).toBeDefined();
    });
    
    it('should calculate correct totals for single card', function() {
      var cards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.totalCreditLimit).toBe(50000);
      expect(portfolio.totalOutstanding).toBe(15000);
      expect(portfolio.totalAvailableCredit).toBe(35000);
      expect(portfolio.cardCount).toBe(1);
    });
    
    it('should calculate correct totals for multiple cards', function() {
      var cards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000},
        {totalLimit: 30000, outstandingBalance: 8000, availableCredit: 22000},
        {totalLimit: 70000, outstandingBalance: 10000, availableCredit: 60000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.totalCreditLimit).toBe(150000);
      expect(portfolio.totalOutstanding).toBe(33000);
      expect(portfolio.totalAvailableCredit).toBe(117000);
      expect(portfolio.cardCount).toBe(3);
    });
    
    it('should include cards array in portfolio', function() {
      var cards = [
        {cardId: 'card001', totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.cards).toEqual(cards);
      expect(portfolio.cards.length).toBe(1);
    });
    
    it('should set userId to user123', function() {
      var cards = [
        {totalLimit: 50000, outstandingBalance: 15000, availableCredit: 35000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.userId).toBe('user123');
    });
    
    it('should return default values for empty array', function() {
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics([]);
      expect(portfolio.userId).toBe('');
      expect(portfolio.cards).toEqual([]);
      expect(portfolio.totalCreditLimit).toBe(0);
      expect(portfolio.totalOutstanding).toBe(0);
      expect(portfolio.totalAvailableCredit).toBe(0);
      expect(portfolio.cardCount).toBe(0);
    });
    
    it('should return default values for null input', function() {
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(null);
      expect(portfolio.userId).toBe('');
      expect(portfolio.cards).toEqual([]);
      expect(portfolio.totalCreditLimit).toBe(0);
      expect(portfolio.totalOutstanding).toBe(0);
      expect(portfolio.totalAvailableCredit).toBe(0);
      expect(portfolio.cardCount).toBe(0);
    });
    
    it('should return default values for undefined input', function() {
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(undefined);
      expect(portfolio.userId).toBe('');
      expect(portfolio.cards).toEqual([]);
      expect(portfolio.totalCreditLimit).toBe(0);
      expect(portfolio.totalOutstanding).toBe(0);
      expect(portfolio.totalAvailableCredit).toBe(0);
      expect(portfolio.cardCount).toBe(0);
    });
    
    it('should handle cards with missing properties', function() {
      var cards = [
        {totalLimit: 50000, outstandingBalance: undefined, availableCredit: 35000},
        {totalLimit: null, outstandingBalance: 8000, availableCredit: 22000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.totalCreditLimit).toBe(50000);
      expect(portfolio.totalOutstanding).toBe(8000);
      expect(portfolio.totalAvailableCredit).toBe(57000);
      expect(portfolio.cardCount).toBe(2);
    });
    
    it('should correctly count cards', function() {
      var cards = [
        {totalLimit: 10000, outstandingBalance: 5000, availableCredit: 5000},
        {totalLimit: 20000, outstandingBalance: 10000, availableCredit: 10000},
        {totalLimit: 30000, outstandingBalance: 15000, availableCredit: 15000},
        {totalLimit: 40000, outstandingBalance: 20000, availableCredit: 20000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.cardCount).toBe(4);
    });
    
    it('should handle large numbers correctly', function() {
      var cards = [
        {totalLimit: 1000000, outstandingBalance: 500000, availableCredit: 500000},
        {totalLimit: 2000000, outstandingBalance: 1000000, availableCredit: 1000000}
      ];
      var portfolio = portfolioAggregationService.calculatePortfolioMetrics(cards);
      expect(portfolio.totalCreditLimit).toBe(3000000);
      expect(portfolio.totalOutstanding).toBe(1500000);
      expect(portfolio.totalAvailableCredit).toBe(1500000);
    });
  });
});