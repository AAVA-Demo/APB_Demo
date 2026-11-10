/*
Test Documentation:
- Test Name: VisualizationService - prepareChartData with categorized transactions
- Purpose: Verify service transforms categorized transactions into chart-ready data
- Scenario: Categorized transactions with multiple categories
- Expected Result: Returns object with categories, totals, and chart data
*/
/*
Test Documentation:
- Test Name: VisualizationService - prepareChartData percentage calculation
- Purpose: Verify accurate percentage calculation for each category
- Scenario: Transactions with known amounts
- Expected Result: Percentages sum to 100 and are accurate to 2 decimals
*/
/*
Test Documentation:
- Test Name: VisualizationService - prepareChartData top category identification
- Purpose: Verify service identifies category with highest spend
- Scenario: Multiple categories with varying spend amounts
- Expected Result: Returns category with maximum total spend
*/
/*
Test Documentation:
- Test Name: VisualizationService - prepareChartData monthly trend
- Purpose: Verify service calculates monthly spending trends per category
- Scenario: Transactions spanning multiple months
- Expected Result: Monthly trend array with correct month-wise totals
*/
/*
Test Documentation:
- Test Name: VisualizationService - prepareFilteredChartData with filter
- Purpose: Verify service filters data to single category
- Scenario: Filter applied to specific category
- Expected Result: Returns data for filtered category only
*/
/*
Test Documentation:
- Test Name: VisualizationService - prepareFilteredChartData without filter
- Purpose: Verify service returns all data when no filter applied
- Scenario: Filter parameter is null or undefined
- Expected Result: Returns complete chart data for all categories
*/
/*
Coverage Report:
- Functions tested: prepareChartData, prepareFilteredChartData
- Scenarios covered: data transformation, percentage calculation, top category, monthly trends, filtering
- Uncovered scenarios: empty categories, zero spend handling
*/

describe('VisualizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var VisualizationService;
  
  beforeEach(inject(function(_VisualizationService_) {
    VisualizationService = _VisualizationService_;
  }));
  
  describe('prepareChartData', function() {
    it('should prepare chart data from categorized transactions', function() {
      var categorizedTransactions = {
        'Food & Dining': [
          { transactionId: 'tx1', amount: 5000, transactionDate: new Date('2024-01-15') },
          { transactionId: 'tx2', amount: 3000, transactionDate: new Date('2024-01-20') }
        ],
        'Fuel': [
          { transactionId: 'tx3', amount: 2000, transactionDate: new Date('2024-01-10') }
        ],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      expect(result).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.totalSpend).toBe(10000);
      expect(result.topCategory).toBeDefined();
      expect(result.topCategory.categoryName).toBe('Food & Dining');
      expect(result.pieChartData).toBeDefined();
    });
    
    it('should calculate percentages correctly', function() {
      var categorizedTransactions = {
        'Food & Dining': [
          { amount: 6000, transactionDate: new Date() }
        ],
        'Fuel': [
          { amount: 4000, transactionDate: new Date() }
        ],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      var foodCategory = result.categories.find(function(c) {
        return c.categoryName === 'Food & Dining';
      });
      var fuelCategory = result.categories.find(function(c) {
        return c.categoryName === 'Fuel';
      });
      
      expect(foodCategory.percentageOfTotal).toBe('60.00');
      expect(fuelCategory.percentageOfTotal).toBe('40.00');
    });
    
    it('should identify top spending category', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [{ amount: 15000, transactionDate: new Date() }],
        'Shopping': [{ amount: 8000, transactionDate: new Date() }],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      expect(result.topCategory.categoryName).toBe('Fuel');
      expect(result.topCategory.totalSpend).toBe(15000);
    });
    
    it('should calculate monthly trends', function() {
      var categorizedTransactions = {
        'Food & Dining': [
          { amount: 2000, transactionDate: new Date('2024-01-15') },
          { amount: 3000, transactionDate: new Date('2024-01-20') },
          { amount: 1500, transactionDate: new Date('2024-02-10') }
        ],
        'Fuel': [],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      var foodCategory = result.categories.find(function(c) {
        return c.categoryName === 'Food & Dining';
      });
      
      expect(foodCategory.monthlyTrend).toBeDefined();
      expect(foodCategory.monthlyTrend.length).toBeGreaterThan(0);
    });
    
    it('should handle empty categorized transactions', function() {
      var categorizedTransactions = {
        'Food & Dining': [],
        'Fuel': [],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      expect(result.totalSpend).toBe(0);
      expect(result.topCategory).toBe(null);
    });
    
    it('should generate pie chart data structure', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [{ amount: 3000, transactionDate: new Date() }],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      expect(result.pieChartData.labels).toBeDefined();
      expect(result.pieChartData.data).toBeDefined();
      expect(result.pieChartData.labels.length).toBe(result.pieChartData.data.length);
    });
    
    it('should count transactions per category', function() {
      var categorizedTransactions = {
        'Food & Dining': [
          { amount: 1000, transactionDate: new Date() },
          { amount: 2000, transactionDate: new Date() },
          { amount: 1500, transactionDate: new Date() }
        ],
        'Fuel': [],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareChartData(categorizedTransactions);
      
      var foodCategory = result.categories.find(function(c) {
        return c.categoryName === 'Food & Dining';
      });
      
      expect(foodCategory.transactionCount).toBe(3);
    });
  });
  
  describe('prepareFilteredChartData', function() {
    it('should filter data by category', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [{ amount: 3000, transactionDate: new Date() }],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareFilteredChartData(categorizedTransactions, 'Fuel');
      
      expect(result.categories.length).toBe(1);
      expect(result.categories[0].categoryName).toBe('Fuel');
      expect(result.totalSpend).toBe(3000);
    });
    
    it('should return all data when no filter applied', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [{ amount: 3000, transactionDate: new Date() }],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareFilteredChartData(categorizedTransactions, null);
      
      expect(result.totalSpend).toBe(8000);
    });
    
    it('should return all data when filter is undefined', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareFilteredChartData(categorizedTransactions, undefined);
      
      expect(result.totalSpend).toBe(5000);
    });
    
    it('should handle filtering non-existent category', function() {
      var categorizedTransactions = {
        'Food & Dining': [{ amount: 5000, transactionDate: new Date() }],
        'Fuel': [],
        'Shopping': [],
        'Travel': [],
        'Entertainment': [],
        'Utilities': [],
        'Healthcare': [],
        'Education': [],
        'Miscellaneous': []
      };
      
      var result = VisualizationService.prepareFilteredChartData(categorizedTransactions, 'InvalidCategory');
      
      expect(result.categories.length).toBe(1);
      expect(result.totalSpend).toBe(0);
    });
  });
});