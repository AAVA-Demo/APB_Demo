/*
Test Documentation:
- Test Name: PortfolioService - loadPortfolio success
- Purpose: Validates that loadPortfolio fetches cards and calculates KPIs
- Scenario: Service successfully loads portfolio data
- Expected Result: Returns object with cards array and kpis object
*/
/*
Test Documentation:
- Test Name: PortfolioService - loadPortfolio with empty cards
- Purpose: Validates handling of empty card list
- Scenario: API returns empty cards array
- Expected Result: Returns empty cards with zero KPIs
*/
/*
Test Documentation:
- Test Name: PortfolioService - loadPortfolio error handling
- Purpose: Validates error propagation from ApiService
- Scenario: ApiService.get fails with error
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: loadPortfolio()
- Scenarios covered: success case, empty data, error handling, KPI calculation integration
- Uncovered scenarios: partial data scenarios, network retry
*/

(function() {
  'use strict';

  describe('PortfolioService', function() {
    var PortfolioService, ApiService, KpiCalculator, $q, $rootScope;

    beforeEach(module('app.portfolio'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_PortfolioService_, _ApiService_, _KpiCalculator_, _$q_, _$rootScope_) {
      PortfolioService = _PortfolioService_;
      ApiService = _ApiService_;
      KpiCalculator = _KpiCalculator_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('loadPortfolio()', function() {
      it('should successfully load portfolio data with cards and KPIs', function() {
        var mockCards = [
          { id: 1, cardName: 'Card 1', creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000 },
          { id: 2, cardName: 'Card 2', creditLimit: 3000, availableCredit: 2000, outstandingAmount: 1000 }
        ];
        var mockKpis = {
          totalCreditLimit: 8000,
          totalAvailableCredit: 5000,
          totalOutstanding: 3000,
          monthlySpend: 3000,
          creditUtilization: 37.5,
          activeCardCount: 2
        };

        spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCards));
        spyOn(KpiCalculator, 'calculateKpis').and.returnValue(mockKpis);

        var result;
        PortfolioService.loadPortfolio().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(ApiService.get).toHaveBeenCalledWith('/cards');
        expect(KpiCalculator.calculateKpis).toHaveBeenCalledWith(mockCards);
        expect(result).toEqual({ cards: mockCards, kpis: mockKpis });
      });

      it('should handle empty cards array', function() {
        var mockKpis = {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          monthlySpend: 0,
          creditUtilization: 0,
          activeCardCount: 0
        };

        spyOn(ApiService, 'get').and.returnValue($q.resolve([]));
        spyOn(KpiCalculator, 'calculateKpis').and.returnValue(mockKpis);

        var result;
        PortfolioService.loadPortfolio().then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.cards).toEqual([]);
        expect(result.kpis.totalCreditLimit).toBe(0);
      });

      it('should propagate errors from ApiService', function() {
        var mockError = { status: 500, message: 'Server Error' };
        spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));

        var error;
        PortfolioService.loadPortfolio().catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toEqual(mockError);
      });
    });
  });
})();