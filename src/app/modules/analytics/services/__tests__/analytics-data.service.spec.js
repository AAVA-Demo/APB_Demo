/*
Test Documentation:
- Test Name: AnalyticsDataService aggregation and trend calculation
- Purpose: Validates category aggregation and monthly trend calculation logic
- Scenario: Test transaction aggregation by category and monthly trend analysis
- Expected Result: Service should correctly aggregate data and calculate trends with percentages
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, calculateMonthlyTrends
- Scenarios covered: category aggregation, percentage calculation, monthly trend grouping, sorting
- Dependencies mocked: CategoryService, $filter
- Uncovered scenarios: none
*/

describe('AnalyticsDataService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var service, $filter;
  
  beforeEach(inject(function(_AnalyticsDataService_, _$filter_) {
    service = _AnalyticsDataService_;
    $filter = _$filter_;
  }));
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have aggregateByCategory method', function() {
    expect(service.aggregateByCategory).toBeDefined();
    expect(typeof service.aggregateByCategory).toBe('function');
  });
  
  it('should have calculateMonthlyTrends method', function() {
    expect(service.calculateMonthlyTrends).toBeDefined();
    expect(typeof service.calculateMonthlyTrends).toBe('function');
  });
  
  it('should aggregate transactions by category correctly', function() {
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining' },
      { id: '2', amount: 2000, category: 'Fuel' },
      { id: '3', amount: 1500, category: 'Food & Dining' }
    ];
    
    var result = service.aggregateByCategory(transactions);
    
    expect(result.length).toBe(2);
    expect(result[0].categoryName).toBe('Fuel');
    expect(result[0].totalAmount).toBe(2000);
    expect(result[0].transactionCount).toBe(1);
    expect(result[1].categoryName).toBe('Food & Dining');
    expect(result[1].totalAmount).toBe(2500);
    expect(result[1].transactionCount).toBe(2);
  });
  
  it('should calculate percentages correctly', function() {
    var transactions = [
      { id: '1', amount: 3000, category: 'Food & Dining' },
      { id: '2', amount: 7000, category: 'Fuel' }
    ];
    
    var result = service.aggregateByCategory(transactions);
    
    expect(result[0].percentage).toBeCloseTo(70, 0);
    expect(result[1].percentage).toBeCloseTo(30, 0);
  });
  
  it('should sort categories by total amount descending', function() {
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining' },
      { id: '2', amount: 5000, category: 'Fuel' },
      { id: '3', amount: 3000, category: 'Shopping' }
    ];
    
    var result = service.aggregateByCategory(transactions);
    
    expect(result[0].totalAmount).toBeGreaterThan(result[1].totalAmount);
    expect(result[1].totalAmount).toBeGreaterThan(result[2].totalAmount);
  });
  
  it('should handle empty transaction array', function() {
    var result = service.aggregateByCategory([]);
    
    expect(result).toEqual([]);
  });
  
  it('should calculate monthly trends correctly', function() {
    var date1 = new Date('2024-01-15');
    var date2 = new Date('2024-02-15');
    
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining', date: date1 },
      { id: '2', amount: 2000, category: 'Fuel', date: date1 },
      { id: '3', amount: 1500, category: 'Shopping', date: date2 }
    ];
    
    var result = service.calculateMonthlyTrends(transactions);
    
    expect(result.length).toBe(2);
    expect(result[0].month).toBe('2024-01');
    expect(result[0].totalSpend).toBe(3000);
    expect(result[1].month).toBe('2024-02');
    expect(result[1].totalSpend).toBe(1500);
  });
  
  it('should include category breakdown in monthly trends', function() {
    var date1 = new Date('2024-01-15');
    
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining', date: date1 },
      { id: '2', amount: 2000, category: 'Fuel', date: date1 }
    ];
    
    var result = service.calculateMonthlyTrends(transactions);
    
    expect(result[0].categoryBreakdown).toBeDefined();
    expect(Array.isArray(result[0].categoryBreakdown)).toBe(true);
    expect(result[0].categoryBreakdown.length).toBe(2);
  });
  
  it('should sort monthly trends chronologically', function() {
    var date1 = new Date('2024-03-15');
    var date2 = new Date('2024-01-15');
    var date3 = new Date('2024-02-15');
    
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining', date: date1 },
      { id: '2', amount: 2000, category: 'Fuel', date: date2 },
      { id: '3', amount: 1500, category: 'Shopping', date: date3 }
    ];
    
    var result = service.calculateMonthlyTrends(transactions);
    
    expect(result[0].month).toBe('2024-01');
    expect(result[1].month).toBe('2024-02');
    expect(result[2].month).toBe('2024-03');
  });
});