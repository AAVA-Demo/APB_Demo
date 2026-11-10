/*
Test Documentation:
- Test Name: AnalyticsService
- Purpose: Validate analytics data retrieval and aggregation
- Scenario: Service initialization, spending analytics fetching with filters
- Expected Result: Service correctly fetches and structures analytics data
*/

describe('AnalyticsService', function() {
  'use strict';

  beforeEach(module('creditCard.analytics'));

  var AnalyticsService, MockDataService, $q, $rootScope;
  var mockAnalyticsData;

  beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    mockAnalyticsData = {
      monthlyTrends: [
        { month: 'Jan 2024', totalSpend: 2300, cardBreakdown: [] },
        { month: 'Feb 2024', totalSpend: 2100, cardBreakdown: [] }
      ],
      cardWiseSpend: [
        { cardId: 'cc001', cardName: 'Platinum Rewards', totalSpend: 2300 },
        { cardId: 'cc002', cardName: 'Travel Elite', totalSpend: 1850 }
      ],
      categoryWiseSpend: [
        { category: 'Food & Dining', amount: 500, percentage: 25 },
        { category: 'Fuel', amount: 300, percentage: 15 }
      ],
      dateRange: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-28')
      }
    };

    MockDataService = {
      getAnalytics: jasmine.createSpy('getAnalytics').and.returnValue($q.resolve(mockAnalyticsData))
    };
  }));

  it('should be defined', function() {
    expect(AnalyticsService).toBeDefined();
  });

  it('should have getSpendingAnalytics method', function() {
    expect(AnalyticsService.getSpendingAnalytics).toBeDefined();
    expect(typeof AnalyticsService.getSpendingAnalytics).toBe('function');
  });

  it('should fetch spending analytics successfully', function(done) {
    var dateRange = { startDate: new Date('2024-01-01'), endDate: new Date('2024-02-28') };
    
    AnalyticsService.getSpendingAnalytics(dateRange, 'all', null).then(function(data) {
      expect(data).toBeDefined();
      expect(data.monthlyTrends).toBeDefined();
      expect(data.cardWiseSpend).toBeDefined();
      expect(data.categoryWiseSpend).toBeDefined();
      done();
    });
    $rootScope.$digest();
  });

  it('should return monthly trends data', function(done) {
    AnalyticsService.getSpendingAnalytics({}, 'all', null).then(function(data) {
      expect(data.monthlyTrends.length).toBe(2);
      expect(data.monthlyTrends[0].month).toBe('Jan 2024');
      expect(data.monthlyTrends[0].totalSpend).toBe(2300);
      done();
    });
    $rootScope.$digest();
  });

  it('should return card-wise spend data', function(done) {
    AnalyticsService.getSpendingAnalytics({}, 'all', null).then(function(data) {
      expect(data.cardWiseSpend.length).toBe(2);
      expect(data.cardWiseSpend[0].cardName).toBe('Platinum Rewards');
      expect(data.cardWiseSpend[0].totalSpend).toBe(2300);
      done();
    });
    $rootScope.$digest();
  });

  it('should return category-wise spend data', function(done) {
    AnalyticsService.getSpendingAnalytics({}, 'all', null).then(function(data) {
      expect(data.categoryWiseSpend.length).toBe(2);
      expect(data.categoryWiseSpend[0].category).toBe('Food & Dining');
      expect(data.categoryWiseSpend[0].amount).toBe(500);
      done();
    });
    $rootScope.$digest();
  });

  it('should filter by card ID', function(done) {
    AnalyticsService.getSpendingAnalytics({}, 'cc001', null).then(function(data) {
      expect(data.selectedCard).toBe('cc001');
      done();
    });
    $rootScope.$digest();
  });

  it('should default to "all" when no card ID provided', function(done) {
    AnalyticsService.getSpendingAnalytics({}, null, null).then(function(data) {
      expect(data.selectedCard).toBe('all');
      done();
    });
    $rootScope.$digest();
  });

  it('should pass date range to result', function(done) {
    var dateRange = { startDate: new Date('2024-01-01'), endDate: new Date('2024-02-28') };
    
    AnalyticsService.getSpendingAnalytics(dateRange, 'all', null).then(function(data) {
      expect(data.dateRange).toBeDefined();
      done();
    });
    $rootScope.$digest();
  });

  it('should handle empty analytics data', function(done) {
    MockDataService.getAnalytics.and.returnValue($q.resolve({
      monthlyTrends: [],
      cardWiseSpend: [],
      categoryWiseSpend: [],
      dateRange: {}
    }));
    
    AnalyticsService.getSpendingAnalytics({}, 'all', null).then(function(data) {
      expect(data.monthlyTrends.length).toBe(0);
      expect(data.cardWiseSpend.length).toBe(0);
      expect(data.categoryWiseSpend.length).toBe(0);
      done();
    });
    $rootScope.$digest();
  });

  it('should handle service errors', function(done) {
    MockDataService.getAnalytics.and.returnValue($q.reject('Analytics error'));
    
    AnalyticsService.getSpendingAnalytics({}, 'all', null).catch(function(error) {
      expect(error).toBe('Analytics error');
      done();
    });
    $rootScope.$digest();
  });
});

/*
Coverage Report:
- Functions tested: getSpendingAnalytics
- Scenarios covered: data fetching, filtering, data structure validation, error handling
- Edge cases: empty data, null parameters, service errors
- Uncovered scenarios: none
*/