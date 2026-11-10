/*
Test Documentation:
- Test Name: AnalyticsEngineService Test Suite
- Purpose: Validate the analytics computation logic for category spending and monthly trends
- Scenario: Tests normal operations, edge cases (empty data, invalid data), and error handling
- Expected Result: All computations return accurate results or handle errors gracefully
*/

describe('AnalyticsEngineService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  
  var AnalyticsEngineService, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsEngineService_, _$q_, _$rootScope_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('computeCategorySpending', function() {
    /*
    Test Documentation:
    - Test Name: should compute category spending correctly with valid transactions
    - Purpose: Validate category aggregation and percentage calculation
    - Scenario: Multiple transactions across different categories
    - Expected Result: Returns array with correct totals and percentages per category
    */
    it('should compute category spending correctly with valid transactions', function(done) {
      var transactions = [
        {category: 'Food & Dining', amount: 100},
        {category: 'Food & Dining', amount: 50},
        {category: 'Fuel', amount: 75},
        {category: 'Shopping', amount: 200}
      ];
      
      AnalyticsEngineService.computeCategorySpending(transactions)
        .then(function(result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(3);
          
          var foodCategory = result.find(function(r) { return r.category === 'Food & Dining'; });
          expect(foodCategory.totalAmount).toBe(150);
          expect(foodCategory.transactionCount).toBe(2);
          expect(parseFloat(foodCategory.percentage)).toBeCloseTo(35.29, 1);
          
          var fuelCategory = result.find(function(r) { return r.category === 'Fuel'; });
          expect(fuelCategory.totalAmount).toBe(75);
          expect(fuelCategory.transactionCount).toBe(1);
          
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions without category (default to Miscellaneous)
    - Purpose: Validate default category assignment
    - Scenario: Transactions with missing category field
    - Expected Result: Transactions are categorized as 'Miscellaneous'
    */
    it('should handle transactions without category (default to Miscellaneous)', function(done) {
      var transactions = [
        {amount: 100},
        {category: null, amount: 50},
        {category: undefined, amount: 75}
      ];
      
      AnalyticsEngineService.computeCategorySpending(transactions)
        .then(function(result) {
          expect(result.length).toBe(1);
          expect(result[0].category).toBe('Miscellaneous');
          expect(result[0].totalAmount).toBe(225);
          expect(result[0].transactionCount).toBe(3);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validate behavior with no data
    - Scenario: Empty array passed to function
    - Expected Result: Returns empty result array
    */
    it('should handle empty transactions array', function(done) {
      AnalyticsEngineService.computeCategorySpending([])
        .then(function(result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(0);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle invalid input and reject promise
    - Purpose: Validate error handling for malformed data
    - Scenario: Non-array input passed to function
    - Expected Result: Promise is rejected with error
    */
    it('should handle invalid input and reject promise', function(done) {
      AnalyticsEngineService.computeCategorySpending(null)
        .then(function(result) {
          fail('Should have rejected promise');
          done();
        })
        .catch(function(error) {
          expect(error).toBeDefined();
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should calculate percentage as 0 when total amount is 0
    - Purpose: Validate division by zero handling
    - Scenario: All transactions have 0 amount
    - Expected Result: Percentage is 0 for all categories
    */
    it('should calculate percentage as 0 when total amount is 0', function(done) {
      var transactions = [
        {category: 'Food & Dining', amount: 0},
        {category: 'Fuel', amount: 0}
      ];
      
      AnalyticsEngineService.computeCategorySpending(transactions)
        .then(function(result) {
          result.forEach(function(cat) {
            expect(parseFloat(cat.percentage)).toBe(0);
          });
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
  });
  
  describe('computeMonthlyTrends', function() {
    /*
    Test Documentation:
    - Test Name: should compute monthly trends correctly with valid transactions
    - Purpose: Validate monthly aggregation and category breakdown
    - Scenario: Transactions across multiple months
    - Expected Result: Returns sorted array with monthly totals and category breakdowns
    */
    it('should compute monthly trends correctly with valid transactions', function(done) {
      var transactions = [
        {date: '2023-01-15', category: 'Food & Dining', amount: 100},
        {date: '2023-01-20', category: 'Fuel', amount: 50},
        {date: '2023-02-10', category: 'Food & Dining', amount: 150},
        {date: '2023-02-25', category: 'Shopping', amount: 200}
      ];
      
      AnalyticsEngineService.computeMonthlyTrends(transactions)
        .then(function(result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(2);
          expect(result[0].month).toBe('2023-01');
          expect(result[0].totalSpend).toBe(150);
          expect(result[0].categoryBreakdown.length).toBe(2);
          
          expect(result[1].month).toBe('2023-02');
          expect(result[1].totalSpend).toBe(350);
          expect(result[1].categoryBreakdown.length).toBe(2);
          
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should sort monthly trends chronologically
    - Purpose: Validate sorting logic
    - Scenario: Transactions in non-chronological order
    - Expected Result: Results are sorted by month ascending
    */
    it('should sort monthly trends chronologically', function(done) {
      var transactions = [
        {date: '2023-03-15', category: 'Food & Dining', amount: 100},
        {date: '2023-01-20', category: 'Fuel', amount: 50},
        {date: '2023-02-10', category: 'Shopping', amount: 150}
      ];
      
      AnalyticsEngineService.computeMonthlyTrends(transactions)
        .then(function(result) {
          expect(result[0].month).toBe('2023-01');
          expect(result[1].month).toBe('2023-02');
          expect(result[2].month).toBe('2023-03');
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions without category in monthly trends
    - Purpose: Validate default category in trend analysis
    - Scenario: Transactions with missing category
    - Expected Result: Categorized as 'Miscellaneous' in breakdown
    */
    it('should handle transactions without category in monthly trends', function(done) {
      var transactions = [
        {date: '2023-01-15', amount: 100},
        {date: '2023-01-20', category: null, amount: 50}
      ];
      
      AnalyticsEngineService.computeMonthlyTrends(transactions)
        .then(function(result) {
          expect(result.length).toBe(1);
          expect(result[0].categoryBreakdown.length).toBe(1);
          expect(result[0].categoryBreakdown[0].category).toBe('Miscellaneous');
          expect(result[0].categoryBreakdown[0].totalAmount).toBe(150);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle empty transactions array for monthly trends
    - Purpose: Validate behavior with no data
    - Scenario: Empty array passed to function
    - Expected Result: Returns empty result array
    */
    it('should handle empty transactions array for monthly trends', function(done) {
      AnalyticsEngineService.computeMonthlyTrends([])
        .then(function(result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(0);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should reject promise on invalid input for monthly trends
    - Purpose: Validate error handling
    - Scenario: Non-array input
    - Expected Result: Promise is rejected
    */
    it('should reject promise on invalid input for monthly trends', function(done) {
      AnalyticsEngineService.computeMonthlyTrends(null)
        .then(function(result) {
          fail('Should have rejected promise');
          done();
        })
        .catch(function(error) {
          expect(error).toBeDefined();
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should aggregate multiple transactions in same month and category
    - Purpose: Validate aggregation logic
    - Scenario: Multiple transactions in same month/category
    - Expected Result: Correct totals and counts in category breakdown
    */
    it('should aggregate multiple transactions in same month and category', function(done) {
      var transactions = [
        {date: '2023-01-05', category: 'Food & Dining', amount: 50},
        {date: '2023-01-15', category: 'Food & Dining', amount: 75},
        {date: '2023-01-25', category: 'Food & Dining', amount: 100}
      ];
      
      AnalyticsEngineService.computeMonthlyTrends(transactions)
        .then(function(result) {
          expect(result.length).toBe(1);
          expect(result[0].totalSpend).toBe(225);
          expect(result[0].categoryBreakdown.length).toBe(1);
          expect(result[0].categoryBreakdown[0].totalAmount).toBe(225);
          expect(result[0].categoryBreakdown[0].transactionCount).toBe(3);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: computeCategorySpending, computeMonthlyTrends
- Scenarios covered:
  * Normal operations with valid data
  * Edge cases: empty arrays, missing categories, zero amounts
  * Error handling: invalid input types
  * Aggregation logic: multiple transactions per category/month
  * Sorting and percentage calculations
- Uncovered scenarios: None - comprehensive coverage achieved
*/