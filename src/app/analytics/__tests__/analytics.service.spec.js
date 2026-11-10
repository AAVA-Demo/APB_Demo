/*
Test Documentation:
- Test Name: AnalyticsService - loadAnalytics success
- Purpose: Validates successful analytics data loading
- Scenario: Service fetches transactions, categorizes, and aggregates
- Expected Result: Returns aggregated analytics data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - integration with CategorizationFactory
- Purpose: Validates integration with categorization
- Scenario: Transactions are categorized before aggregation
- Expected Result: CategorizationFactory.categorizeTransactions called
*/
/*
Test Documentation:
- Test Name: AnalyticsService - integration with AggregationService
- Purpose: Validates integration with aggregation
- Scenario: Categorized transactions are aggregated
- Expected Result: AggregationService.aggregateData called with categorized data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - error handling
- Purpose: Validates error propagation
- Scenario: ApiService fails
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: loadAnalytics()
- Scenarios covered: success, categorization integration, aggregation integration, error handling
- Uncovered scenarios: partial data, large datasets
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, ApiService, CategorizationFactory, AggregationService, $q, $rootScope;

    beforeEach(module('app.analytics'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _ApiService_, _CategorizationFactory_, _AggregationService_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      ApiService = _ApiService_;
      CategorizationFactory = _CategorizationFactory_;
      AggregationService = _AggregationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('loadAnalytics()', function() {
      it('should load analytics data successfully', function() {
        var mockTransactions = [
          { id: 1, merchant: 'Starbucks', amount: 5.50, date: '2024-01-15' },
          { id: 2, merchant: 'Shell', amount: 45.00, date: '2024-01-16' }
        ];
        var categorizedTransactions = [
          { id: 1, merchant: 'Starbucks', amount: 5.50, date: '2024-01-15', category: 'Food & Dining' },
          { id: 2, merchant: 'Shell', amount: 45.00, date: '2024-01-16', category: 'Fuel' }
        ];
        var aggregatedData = {
          categorySpends: [{ category: 'Food & Dining', totalAmount: 5.50 }],
          monthlyTrends: [{ month: '2024-01', totalSpend: 50.50 }],
          cardSpends: [{ cardId: 'card1', totalSpend: 50.50 }]
        };

        spyOn(ApiService, 'get').and.returnValue($q.resolve({ transactions: mockTransactions }));
        spyOn(CategorizationFactory, 'categorizeTransactions').and.returnValue(categorizedTransactions);
        spyOn(AggregationService, 'aggregateData').and.returnValue(aggregatedData);

        var result;
        AnalyticsService.loadAnalytics().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(ApiService.get).toHaveBeenCalledWith('/transactions', { all: true });
        expect(CategorizationFactory.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
        expect(AggregationService.aggregateData).toHaveBeenCalledWith(categorizedTransactions);
        expect(result).toEqual(aggregatedData);
      });

      it('should handle empty transactions array', function() {
        spyOn(ApiService, 'get').and.returnValue($q.resolve({ transactions: [] }));
        spyOn(CategorizationFactory, 'categorizeTransactions').and.returnValue([]);
        spyOn(AggregationService, 'aggregateData').and.returnValue({
          categorySpends: [],
          monthlyTrends: [],
          cardSpends: []
        });

        var result;
        AnalyticsService.loadAnalytics().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.categorySpends).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.cardSpends).toEqual([]);
      });

      it('should propagate errors from ApiService', function() {
        var mockError = { status: 500, message: 'Server Error' };
        spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));

        var error;
        AnalyticsService.loadAnalytics().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toEqual(mockError);
      });
    });
  });
})();