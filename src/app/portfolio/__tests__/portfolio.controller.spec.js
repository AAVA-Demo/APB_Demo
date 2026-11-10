/*
Test Documentation:
- Test Name: PortfolioController - initialization
- Purpose: Validates controller initializes and loads data on startup
- Scenario: Controller is instantiated
- Expected Result: loadData is called and portfolio data is loaded
*/
/*
Test Documentation:
- Test Name: PortfolioController - successful data load
- Purpose: Validates successful portfolio data loading
- Scenario: PortfolioService returns valid data
- Expected Result: vm.cards and vm.kpis are populated, loading is false
*/
/*
Test Documentation:
- Test Name: PortfolioController - error handling
- Purpose: Validates error handling when data load fails
- Scenario: PortfolioService rejects with error
- Expected Result: vm.error is set, loading is false
*/
/*
Test Documentation:
- Test Name: PortfolioController - auto-refresh interval
- Purpose: Validates automatic data refresh every 30 seconds
- Scenario: Controller sets up interval for auto-refresh
- Expected Result: loadData is called periodically
*/
/*
Test Documentation:
- Test Name: PortfolioController - cleanup on destroy
- Purpose: Validates interval cleanup on controller destruction
- Scenario: $scope.$destroy event is triggered
- Expected Result: Interval is cancelled
*/
/*
Coverage Report:
- Functions tested: initialization, loadData, auto-refresh, cleanup
- Scenarios covered: success, error, interval setup, cleanup
- Uncovered scenarios: multiple rapid refreshes, network interruption
*/

(function() {
  'use strict';

  describe('PortfolioController', function() {
    var $controller, $scope, $interval, $q, PortfolioService, controller;

    beforeEach(module('app.portfolio'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_, _$q_, _PortfolioService_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $interval = _$interval_;
      $q = _$q_;
      PortfolioService = _PortfolioService_;
    }));

    function createController() {
      return $controller('PortfolioController', {
        $scope: $scope,
        $interval: $interval,
        PortfolioService: PortfolioService
      });
    }

    describe('initialization', function() {
      it('should initialize with default values', function() {
        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.resolve({ cards: [], kpis: {} }));
        controller = createController();

        expect(controller.cards).toEqual([]);
        expect(controller.kpis).toEqual({});
        expect(controller.loading).toBe(true);
        expect(controller.error).toBe(null);
      });

      it('should call loadData on initialization', function() {
        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.resolve({ cards: [], kpis: {} }));
        controller = createController();

        expect(PortfolioService.loadPortfolio).toHaveBeenCalled();
      });
    });

    describe('loadData', function() {
      it('should load portfolio data successfully', function() {
        var mockData = {
          cards: [
            { id: 1, cardName: 'Test Card 1' },
            { id: 2, cardName: 'Test Card 2' }
          ],
          kpis: {
            totalCreditLimit: 10000,
            totalAvailableCredit: 7000,
            totalOutstanding: 3000,
            monthlySpend: 2500
          }
        };

        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.resolve(mockData));
        controller = createController();
        $scope.$apply();

        expect(controller.cards).toEqual(mockData.cards);
        expect(controller.kpis).toEqual(mockData.kpis);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBe(null);
      });

      it('should handle errors when loading portfolio data', function() {
        spyOn(console, 'error');
        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.reject({ message: 'Network error' }));
        controller = createController();
        $scope.$apply();

        expect(controller.error).toBe('Failed to load portfolio data');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('auto-refresh', function() {
      it('should set up interval for auto-refresh every 30 seconds', function() {
        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.resolve({ cards: [], kpis: {} }));
        controller = createController();
        $scope.$apply();

        expect(PortfolioService.loadPortfolio.calls.count()).toBe(1);

        $interval.flush(30000);
        expect(PortfolioService.loadPortfolio.calls.count()).toBe(2);

        $interval.flush(30000);
        expect(PortfolioService.loadPortfolio.calls.count()).toBe(3);
      });
    });

    describe('cleanup', function() {
      it('should cancel interval on scope destroy', function() {
        spyOn(PortfolioService, 'loadPortfolio').and.returnValue($q.resolve({ cards: [], kpis: {} }));
        spyOn($interval, 'cancel');
        controller = createController();
        $scope.$apply();

        $scope.$destroy();

        expect($interval.cancel).toHaveBeenCalled();
      });
    });
  });
})();