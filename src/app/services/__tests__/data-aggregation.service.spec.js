/*
Test Documentation:
- Test Name: DataAggregationService - computeMonthlyRollups aggregates transactions by month
- Purpose: Validates monthly transaction aggregation logic
- Scenario: Service receives transactions spanning multiple months
- Expected Result: Returns array of monthly spend objects with correct totals and card-wise breakdowns
*/
/*
Test Documentation:
- Test Name: DataAggregationService - filterByCards filters monthly spends by selected cards
- Purpose: Validates card-specific filtering of monthly data
- Scenario: User selects specific cards to analyze
- Expected Result: Returns filtered monthly spends containing only selected card data
*/
/*
Test Documentation:
- Test Name: DataAggregationService - filterByCards returns all data when no cards selected
- Purpose: Validates default behavior when no filter is applied
- Scenario: Empty or null selectedCards array is provided
- Expected Result: Returns unfiltered monthly spends
*/
/*
Coverage Report:
- Functions tested: computeMonthlyRollups, filterByCards
- Scenarios covered: monthly aggregation, card-wise breakdown, filtering by cards, empty filter handling
- Uncovered scenarios: none
*/

describe('DataAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DataAggregationService;
  var $rootScope;
  
  beforeEach(inject(function(_DataAggregationService_, _$rootScope_) {
    DataAggregationService = _DataAggregationService_;
    $rootScope = _$rootScope_;
  }));
  
  describe('computeMonthlyRollups', function() {
    
    it('should aggregate transactions by month', function() {
      var mockTransactions = [
        { cardId: 'card001', amount: 1000, transactionDate: new Date('2024-01-15') },
        { cardId: 'card001', amount: 500, transactionDate: new Date('2024-01-20') },
        { cardId: 'card002', amount: 2000, transactionDate: new Date('2024-02-10') },
        { cardId: 'card001', amount: 1500, transactionDate: new Date('2024-02-15') }
      ];
      var mockCards = [];
      
      var result = DataAggregationService.computeMonthlyRollups(mockTransactions, mockCards);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      
      var jan2024 = result.find(function(m) { return m.month === '2024-01'; });
      expect(jan2024).toBeDefined();
      expect(jan2024.totalSpend).toBe(1500);
      expect(jan2024.transactionCount).toBe(2);
      
      var feb2024 = result.find(function(m) { return m.month === '2024-02'; });
      expect(feb2024).toBeDefined();
      expect(feb2024.totalSpend).toBe(3500);
      expect(feb2024.transactionCount).toBe(2);
    });
    
    it('should create card-wise spend breakdown for each month', function() {
      var mockTransactions = [
        { cardId: 'card001', amount: 1000, transactionDate: new Date('2024-01-15') },
        { cardId: 'card002', amount: 500, transactionDate: new Date('2024-01-20') },
        { cardId: 'card003', amount: 2000, transactionDate: new Date('2024-01-25') }
      ];
      var mockCards = [];
      
      var result = DataAggregationService.computeMonthlyRollups(mockTransactions, mockCards);
      
      expect(result.length).toBe(1);
      var month = result[0];
      expect(month.cardWiseSpend).toBeDefined();
      expect(month.cardWiseSpend['card001']).toBe(1000);
      expect(month.cardWiseSpend['card002']).toBe(500);
      expect(month.cardWiseSpend['card003']).toBe(2000);
    });
    
    it('should sort monthly spends chronologically', function() {
      var mockTransactions = [
        { cardId: 'card001', amount: 1000, transactionDate: new Date('2024-03-15') },
        { cardId: 'card001', amount: 500, transactionDate: new Date('2024-01-20') },
        { cardId: 'card001', amount: 2000, transactionDate: new Date('2024-02-10') }
      ];
      var mockCards = [];
      
      var result = DataAggregationService.computeMonthlyRollups(mockTransactions, mockCards);
      
      expect(result.length).toBe(3);
      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
      expect(result[2].month).toBe('2024-03');
    });
    
    it('should handle empty transaction array', function() {
      var result = DataAggregationService.computeMonthlyRollups([], []);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
    
    it('should accumulate multiple transactions for same card in same month', function() {
      var mockTransactions = [
        { cardId: 'card001', amount: 1000, transactionDate: new Date('2024-01-05') },
        { cardId: 'card001', amount: 500, transactionDate: new Date('2024-01-15') },
        { cardId: 'card001', amount: 2000, transactionDate: new Date('2024-01-25') }
      ];
      var mockCards = [];
      
      var result = DataAggregationService.computeMonthlyRollups(mockTransactions, mockCards);
      
      expect(result.length).toBe(1);
      expect(result[0].cardWiseSpend['card001']).toBe(3500);
      expect(result[0].totalSpend).toBe(3500);
      expect(result[0].transactionCount).toBe(3);
    });
  });
  
  describe('filterByCards', function() {
    
    it('should filter monthly spends by selected cards', function() {
      var monthlySpends = [
        {
          month: '2024-01',
          totalSpend: 5000,
          cardWiseSpend: { 'card001': 2000, 'card002': 1500, 'card003': 1500 },
          transactionCount: 10
        }
      ];
      var selectedCards = ['card001', 'card003'];
      
      var result = DataAggregationService.filterByCards(monthlySpends, selectedCards);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(3500);
      expect(result[0].cardWiseSpend['card001']).toBe(2000);
      expect(result[0].cardWiseSpend['card003']).toBe(1500);
      expect(result[0].cardWiseSpend['card002']).toBeUndefined();
    });
    
    it('should return all data when selectedCards is empty', function() {
      var monthlySpends = [
        {
          month: '2024-01',
          totalSpend: 5000,
          cardWiseSpend: { 'card001': 2000, 'card002': 3000 },
          transactionCount: 10
        }
      ];
      
      var result = DataAggregationService.filterByCards(monthlySpends, []);
      
      expect(result).toBe(monthlySpends);
    });
    
    it('should return all data when selectedCards is null', function() {
      var monthlySpends = [
        {
          month: '2024-01',
          totalSpend: 5000,
          cardWiseSpend: { 'card001': 2000, 'card002': 3000 },
          transactionCount: 10
        }
      ];
      
      var result = DataAggregationService.filterByCards(monthlySpends, null);
      
      expect(result).toBe(monthlySpends);
    });
    
    it('should handle multiple months with card filtering', function() {
      var monthlySpends = [
        {
          month: '2024-01',
          totalSpend: 5000,
          cardWiseSpend: { 'card001': 2000, 'card002': 3000 },
          transactionCount: 10
        },
        {
          month: '2024-02',
          totalSpend: 4000,
          cardWiseSpend: { 'card001': 1500, 'card002': 2500 },
          transactionCount: 8
        }
      ];
      var selectedCards = ['card001'];
      
      var result = DataAggregationService.filterByCards(monthlySpends, selectedCards);
      
      expect(result.length).toBe(2);
      expect(result[0].totalSpend).toBe(2000);
      expect(result[1].totalSpend).toBe(1500);
    });
    
    it('should preserve transaction count when filtering', function() {
      var monthlySpends = [
        {
          month: '2024-01',
          totalSpend: 5000,
          cardWiseSpend: { 'card001': 2000, 'card002': 3000 },
          transactionCount: 10
        }
      ];
      var selectedCards = ['card001'];
      
      var result = DataAggregationService.filterByCards(monthlySpends, selectedCards);
      
      expect(result[0].transactionCount).toBe(10);
    });
  });
});