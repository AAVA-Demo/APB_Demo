(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['$scope', 'PortfolioService', 'KpiCalculationService', 'RefreshFactory', function($scope, PortfolioService, KpiCalculationService, RefreshFactory) {
    const vm = this;
    vm.portfolioData = { cards: [], kpis: {} };
    vm.loading = true;
    vm.errorMessage = '';
    let refreshPromise = null;
    vm.loadPortfolio = function() {
      vm.loading = true;
      vm.errorMessage = '';
      PortfolioService.getPortfolio().then(function(data) {
        vm.portfolioData.cards = data.cards || [];
        vm.portfolioData.kpis = KpiCalculationService.calculateKpis(vm.portfolioData.cards);
        vm.loading = false;
      }).catch(function(error) {
        vm.errorMessage = 'Failed to load portfolio data. Please try again.';
        vm.loading = false;
        vm.portfolioData = { cards: getMockCards(), kpis: {} };
        vm.portfolioData.kpis = KpiCalculationService.calculateKpis(vm.portfolioData.cards);
      });
    };
    function getMockCards() {
      return [
        { cardId: '1', cardName: 'Visa Platinum', cardNumber: '****1234', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, lastUpdated: new Date() },
        { cardId: '2', cardName: 'MasterCard Gold', cardNumber: '****5678', creditLimit: 30000, availableCredit: 25000, outstandingAmount: 5000, lastUpdated: new Date() },
        { cardId: '3', cardName: 'Amex Blue', cardNumber: '****9012', creditLimit: 40000, availableCredit: 30000, outstandingAmount: 10000, lastUpdated: new Date() }
      ];
    }
    vm.loadPortfolio();
    refreshPromise = RefreshFactory.startPolling(vm.loadPortfolio, 30000);
    $scope.$on('$destroy', function() {
      RefreshFactory.stopPolling(refreshPromise);
    });
  }]);
})();