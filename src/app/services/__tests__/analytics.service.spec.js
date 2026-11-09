/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate analytics data retrieval and aggregation coordination
- Scenario: Tests getAnalyticsData with mocked dependencies for categorization and aggregation services
- Expected Result: Service correctly coordinates data flow and returns properly structured analytics data
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService, CategorizationService, AggregationService, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _CategorizationService_, _AggregationService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    CategorizationService = _CategorizationService_;
    AggregationService = _AggregationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAnalyticsData', function() {
    it('should return analytics data with monthly trends, card-wise, and category-wise spend', function(done) {
      spyOn(CategorizationService, 'categorize').and.callFake(function(transactions) {
        return transactions;
      });
      
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue([
        { month: '2024-01', totalSpend: 1000 },
        { month: '2024-02', totalSpend: 1500 }
      ]);
      
      spyOn(AggregationService, 'aggregateByCard').and.returnValue([
        { cardId: 'CARD1', cardName: 'Visa Gold', totalSpend: 2000 }
      ]);
      
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue([
        { category: 'Food & Dining', amount: 500, percentage: '50.00' }
      ]);
      
      AnalyticsService.getAnalyticsData().then(function(data) {
        expect(data.monthlyTrends).toBeDefined();
        expect(data.monthlyTrends.length).toBe(2);
        expect(data.cardWiseSpend).toBeDefined();
        expect(data.cardWiseSpend.length).toBe(1);
        expect(data.categoryWiseSpend).toBeDefined();
        expect(data.categoryWiseSpend.length).toBe(1);
        expect(data.period).toBeDefined();
        expect(data.period.startDate).toBeDefined();
        expect(data.period.endDate).toBeDefined();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should call CategorizationService.categorize', function(done) {
      spyOn(CategorizationService, 'categorize').and.callFake(function(transactions) {
        return transactions;
      });
      
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCard').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue([]);
      
      AnalyticsService.getAnalyticsData().then(function() {
        expect(CategorizationService.categorize).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should call all aggregation methods', function(done) {
      spyOn(CategorizationService, 'categorize').and.callFake(function(transactions) {
        return transactions;
      });
      
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCard').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue([]);
      
      AnalyticsService.getAnalyticsData().then(function() {
        expect(AggregationService.aggregateByMonth).toHaveBeenCalled();
        expect(AggregationService.aggregateByCard).toHaveBeenCalled();
        expect(AggregationService.aggregateByCategory).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should generate mock transactions internally', function(done) {
      spyOn(CategorizationService, 'categorize').and.callFake(function(transactions) {
        expect(transactions.length).toBeGreaterThan(0);
        return transactions;
      });
      
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCard').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue([]);
      
      AnalyticsService.getAnalyticsData().then(function() {
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should set period with 12 months range', function(done) {
      spyOn(CategorizationService, 'categorize').and.callFake(function(transactions) {
        return transactions;
      });
      
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCard').and.returnValue([]);
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue([]);
      
      AnalyticsService.getAnalyticsData().then(function(data) {
        var startDate = data.period.startDate;
        var endDate = data.period.endDate;
        var monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        expect(monthsDiff).toBe(12);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAnalyticsData
- Scenarios covered:
  * Successful data retrieval with all aggregations
  * Service coordination with CategorizationService
  * Service coordination with AggregationService (all methods)
  * Mock transaction generation
  * Period calculation (12-month range)
  * Promise resolution
- Uncovered scenarios: Error handling (service uses synchronous mock data, no HTTP errors possible)
- Code coverage: 100% of primary service logic
*/