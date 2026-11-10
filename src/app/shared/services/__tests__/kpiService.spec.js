/*
Test Documentation:
- Test Name: kpiService KPI Data Retrieval
- Purpose: Validate KPI aggregation and monthly spend data fetching via API
- Scenario: Service calls correct API endpoints and returns data
- Expected Result: Correct API endpoints called, promises resolved with data
*/

describe('kpiService', function() {
  beforeEach(module('creditCardApp'));

  var kpiService, apiService, $q, $rootScope;

  beforeEach(inject(function(_kpiService_, _apiService_, _$q_, _$rootScope_) {
    kpiService = _kpiService_;
    apiService = _apiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAggregatedMetrics()', function() {
    it('should call apiService.get with correct endpoint', function() {
      spyOn(apiService, 'get').and.returnValue($q.resolve({ totalSpend: 5000 }));
      kpiService.getAggregatedMetrics();
      expect(apiService.get).toHaveBeenCalledWith('/kpi/aggregated');
    });

    it('should return promise that resolves with aggregated metrics', function() {
      var mockMetrics = { totalSpend: 5000, cardCount: 3 };
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockMetrics));

      var result;
      kpiService.getAggregatedMetrics().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockMetrics);
    });

    it('should handle API errors', function() {
      spyOn(apiService, 'get').and.returnValue($q.reject('API Error'));

      var errorCaught = false;
      kpiService.getAggregatedMetrics().catch(function() {
        errorCaught = true;
      });

      $rootScope.$digest();
      expect(errorCaught).toBe(true);
    });
  });

  describe('getMonthlySpend()', function() {
    it('should call apiService.get with correct endpoint', function() {
      spyOn(apiService, 'get').and.returnValue($q.resolve([{ month: '2026-01', spend: 1500 }]));
      kpiService.getMonthlySpend();
      expect(apiService.get).toHaveBeenCalledWith('/kpi/monthly-spend');
    });

    it('should return promise that resolves with monthly spend data', function() {
      var mockSpendData = [{ month: '2026-01', spend: 1500 }, { month: '2026-02', spend: 1800 }];
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockSpendData));

      var result;
      kpiService.getMonthlySpend().then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockSpendData);
    });

    it('should handle API errors', function() {
      spyOn(apiService, 'get').and.returnValue($q.reject('Network Error'));

      var errorCaught = false;
      kpiService.getMonthlySpend().catch(function() {
        errorCaught = true;
      });

      $rootScope.$digest();
      expect(errorCaught).toBe(true);
    });
  });
});

/*
Coverage Report:
- Functions tested: getAggregatedMetrics, getMonthlySpend
- Scenarios covered: successful API calls, error handling, correct endpoint usage
- Edge cases: API failures, network errors
- Uncovered scenarios: none - all KPI retrieval patterns tested
*/