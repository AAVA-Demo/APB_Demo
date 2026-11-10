/*
Test Documentation:
- Test Name: AnalyticsController - initialization
- Purpose: Validates controller initializes and loads analytics
- Scenario: Controller is instantiated
- Expected Result: loadAnalytics called and data loaded
*/
/*
Test Documentation:
- Test Name: AnalyticsController - successful analytics load
- Purpose: Validates successful analytics data loading
- Scenario: AnalyticsService returns aggregated data
- Expected Result: All analytics data and chart data populated
*/
/*
Test Documentation:
- Test Name: AnalyticsController - chart data preparation
- Purpose: Validates chart data arrays are prepared correctly
- Scenario: Analytics data is transformed for charts
- Expected Result: Chart data and labels arrays populated
*/
/*
Test Documentation:
- Test Name: AnalyticsController - error handling
- Purpose: Validates error handling when analytics load fails
- Scenario: AnalyticsService rejects with error
- Expected Result: vm.error set, loading false
*/
/*
Coverage Report:
- Functions tested: initialization, loadAnalytics, chart data preparation
- Scenarios covered: success, error, data transformation
- Uncovered scenarios: partial data, refresh functionality
*/

(function() {
  'use strict';

  describe('AnalyticsController', function() {
    var $controller, $scope, $q, AnalyticsService, controller;

    beforeEach(module('app.analytics'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _AnalyticsService_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;
      AnalyticsService = _AnalyticsService_;
    }));

    function createController() {
      return $controller('AnalyticsController', {
        $scope: $scope,
        AnalyticsService: AnalyticsService
      });
    }

    describe('initialization', function() {
      it('should initialize with default values', function() {
        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve({
          categorySpends: [],
          monthlyTrends: [],
          cardSpends: []
        }));

        controller = createController();

        expect(controller.categorySpends).toEqual([]);
        expect(controller.monthlyTrends).toEqual([]);
        expect(controller.cardSpends).toEqual([]);
        expect(controller.loading).toBe(true);
        expect(controller.error).toBe(null);
      });

      it('should call loadAnalytics on initialization', function() {
        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve({
          categorySpends: [],
          monthlyTrends: [],
          cardSpends: []
        }));

        controller = createController();

        expect(AnalyticsService.loadAnalytics).toHaveBeenCalled();
      });
    });

    describe('loadAnalytics', function() {
      it('should load analytics data successfully', function() {
        var mockData = {
          categorySpends: [
            { category: 'Food & Dining', totalAmount: 150.00, transactionCount: 5, percentage: 60.00 },
            { category: 'Fuel', totalAmount: 100.00, transactionCount: 3, percentage: 40.00 }
          ],
          monthlyTrends: [
            { month: '2024-01', totalSpend: 250.00 },
            { month: '2024-02', totalSpend: 300.00 }
          ],
          cardSpends: [
            { cardId: 'card1', cardName: 'Visa Card', totalSpend: 200.00 },
            { cardId: 'card2', cardName: 'Mastercard', totalSpend: 350.00 }
          ]
        };

        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve(mockData));
        controller = createController();
        $scope.$apply();

        expect(controller.categorySpends).toEqual(mockData.categorySpends);
        expect(controller.monthlyTrends).toEqual(mockData.monthlyTrends);
        expect(controller.cardSpends).toEqual(mockData.cardSpends);
        expect(controller.loading).toBe(false);
      });

      it('should prepare chart data for category spends', function() {
        var mockData = {
          categorySpends: [
            { category: 'Food & Dining', totalAmount: 150.00 },
            { category: 'Fuel', totalAmount: 100.00 }
          ],
          monthlyTrends: [],
          cardSpends: []
        };

        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve(mockData));
        controller = createController();
        $scope.$apply();

        expect(controller.categoryChartData).toEqual([150.00, 100.00]);
        expect(controller.categoryChartLabels).toEqual(['Food & Dining', 'Fuel']);
      });

      it('should prepare chart data for monthly trends', function() {
        var mockData = {
          categorySpends: [],
          monthlyTrends: [
            { month: '2024-01', totalSpend: 250.00 },
            { month: '2024-02', totalSpend: 300.00 }
          ],
          cardSpends: []
        };

        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve(mockData));
        controller = createController();
        $scope.$apply();

        expect(controller.monthlyChartData).toEqual([250.00, 300.00]);
        expect(controller.monthlyChartLabels).toEqual(['2024-01', '2024-02']);
      });

      it('should prepare chart data for card spends', function() {
        var mockData = {
          categorySpends: [],
          monthlyTrends: [],
          cardSpends: [
            { cardId: 'card1', cardName: 'Visa Card', totalSpend: 200.00 },
            { cardId: 'card2', cardName: 'Mastercard', totalSpend: 350.00 }
          ]
        };

        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.resolve(mockData));
        controller = createController();
        $scope.$apply();

        expect(controller.cardChartData).toEqual([200.00, 350.00]);
        expect(controller.cardChartLabels).toEqual(['Visa Card', 'Mastercard']);
      });

      it('should handle errors when loading analytics', function() {
        spyOn(console, 'error');
        spyOn(AnalyticsService, 'loadAnalytics').and.returnValue($q.reject({ message: 'Network error' }));
        controller = createController();
        $scope.$apply();

        expect(controller.error).toBe('Failed to load analytics data');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();