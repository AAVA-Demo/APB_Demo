(function() {
  'use strict';
  angular.module('app.portfolio')
    .controller('PortfolioController', ['$scope', '$interval', 'PortfolioService', function($scope, $interval, PortfolioService) {
      var vm = this;
      vm.cards = [];
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      function loadData() {
        vm.loading = true;
        PortfolioService.loadPortfolio().then(function(data) {
          vm.cards = data.cards;
          vm.kpis = data.kpis;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load portfolio data';
          vm.loading = false;
          console.error(error);
        });
      }
      loadData();
      var refreshInterval = $interval(loadData, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
  PortfolioController.$inject = ['$scope', '$interval', 'PortfolioService'];
})();