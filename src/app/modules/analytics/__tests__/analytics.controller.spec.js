/*
Test Documentation:
- Test Name: AnalyticsController
- Purpose: Validate analytics controller for spending insights and visualizations
- Scenario: Controller initialization, analytics loading, error handling
- Expected Result: Analytics data loaded correctly, errors handled
*/

describe('AnalyticsController', function() {
  'use strict';
  
  var controller, AnalyticsService, $q, $scope, $rootScope;
  var mockAnalyticsData;
  
  beforeEach(module('creditcard.analytics'));
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    
    mockAnalyticsData = {
      categorySpends: [
        {category: 'Food & Dining', totalAmount: 4300, transactionCount: 2},
        {category: 'Fuel', totalAmount: 2500, transactionCount: 2},
        {category: 'Shopping', totalAmount: 9500, transactionCount: 2},
        {category: 'Travel', totalAmount: 14000, transactionCount: 2}
      ],
      monthlyTrends: [
        {month: '2024-01', totalAmount: 16700, categoryBreakdown: []},
        {month: '2024-02', totalAmount: 13600, categoryBreakdown: []}
      ],
      cardSpends: [
        {cardId: 'CC001', cardName: 'CC001', totalSpend: 14300, categoryBreakdown: []},
        {cardId: 'CC002', cardName: 'CC002', totalSpend: 7800, categoryBreakdown: []},
        {cardId: 'CC003', cardName: 'CC003', totalSpend: 8200, categoryBreakdown: []}
      ]
    };
    
    AnalyticsService = {
      getAnalytics: jasmine.createSpy('getAnalytics').and.returnValue($q.resolve(mockAnalyticsData))
    };
    
    controller = $controller('AnalyticsController', {
      AnalyticsService: AnalyticsService,
      $scope: $scope
    });
  }));
  
  describe('Controller Initialization', function() {
    it('should initialize controller with default values', function() {
      expect(controller.analyticsData).toEqual({});
      expect(controller.loading).toBe(true);
      expect(controller.error).toBe(null);
    });
    
    it('should call loadAnalytics on activation', function() {
      expect(AnalyticsService.getAnalytics).toHaveBeenCalled();
    });
  });
  
  describe('Analytics Loading - Success Scenario', function() {
    it('should load analytics data successfully', function() {
      $rootScope.$digest();
      expect(controller.analyticsData).toEqual(mockAnalyticsData);
      expect(controller.loading).toBe(false);
      expect(controller.error).toBe(null);
    });
    
    it('should load category spending data', function() {
      $rootScope.$digest();
      expect(controller.analyticsData.categorySpends).toBeDefined();
      expect(controller.analyticsData.categorySpends.length).toBe(4);
      expect(controller.analyticsData.categorySpends[0].category).toBe('Food & Dining');
    });
    
    it('should load monthly trends data', function() {
      $rootScope.$digest();
      expect(controller.analyticsData.monthlyTrends).toBeDefined();
      expect(controller.analyticsData.monthlyTrends.length).toBe(2);
      expect(controller.analyticsData.monthlyTrends[0].month).toBe('2024-01');
    });
    
    it('should load card-wise spending data', function() {
      $rootScope.$digest();
      expect(controller.analyticsData.cardSpends).toBeDefined();
      expect(controller.analyticsData.cardSpends.length).toBe(3);
      expect(controller.analyticsData.cardSpends[0].cardId).toBe('CC001');
    });
    
    it('should set loading to true before fetching', function() {
      controller.loading = false;
      AnalyticsService.getAnalytics.and.returnValue($q.resolve(mockAnalyticsData));
      inject(function($controller) {
        controller = $controller('AnalyticsController', {
          AnalyticsService: AnalyticsService,
          $scope: $scope
        });
      });
      expect(controller.loading).toBe(true);
    });
  });
  
  describe('Analytics Loading - Error Scenario', function() {
    beforeEach(function() {
      AnalyticsService.getAnalytics.and.returnValue($q.reject('Service error'));
      inject(function($controller) {
        controller = $controller('AnalyticsController', {
          AnalyticsService: AnalyticsService,
          $scope: $scope
        });
      });
    });
    
    it('should handle error when loading fails', function() {
      $rootScope.$digest();
      expect(controller.error).toBe('Failed to load analytics data. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should not update analyticsData on error', function() {
      $rootScope.$digest();
      expect(controller.analyticsData).toEqual({});
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty analytics data', function() {
      var emptyData = {
        categorySpends: [],
        monthlyTrends: [],
        cardSpends: []
      };
      AnalyticsService.getAnalytics.and.returnValue($q.resolve(emptyData));
      inject(function($controller) {
        controller = $controller('AnalyticsController', {
          AnalyticsService: AnalyticsService,
          $scope: $scope
        });
      });
      $rootScope.$digest();
      expect(controller.analyticsData.categorySpends.length).toBe(0);
      expect(controller.analyticsData.monthlyTrends.length).toBe(0);
      expect(controller.analyticsData.cardSpends.length).toBe(0);
    });
    
    it('should handle null response', function() {
      AnalyticsService.getAnalytics.and.returnValue($q.resolve(null));
      inject(function($controller) {
        controller = $controller('AnalyticsController', {
          AnalyticsService: AnalyticsService,
          $scope: $scope
        });
      });
      $rootScope.$digest();
      expect(controller.analyticsData).toBe(null);
    });
    
    it('should handle partial data', function() {
      var partialData = {
        categorySpends: [{category: 'Food', totalAmount: 1000}],
        monthlyTrends: [],
        cardSpends: []
      };
      AnalyticsService.getAnalytics.and.returnValue($q.resolve(partialData));
      inject(function($controller) {
        controller = $controller('AnalyticsController', {
          AnalyticsService: AnalyticsService,
          $scope: $scope
        });
      });
      $rootScope.$digest();
      expect(controller.analyticsData.categorySpends.length).toBe(1);
    });
  });
});

/*
Coverage Report:
- Functions tested: activate, loadAnalytics
- Scenarios covered: Initialization, successful loading, error handling, empty data, null response, partial data
- Edge cases: Empty analytics, null response, partial data
- Uncovered scenarios: None
*/