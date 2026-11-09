(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'DataAggregationFactory', 'NotificationService', DashboardController]);

  function DashboardController($scope, $interval, DashboardService, DataAggregationFactory, NotificationService) {
    var vm = this;
    vm.kpis = {};
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;
    var refreshInterval;

    vm.init = function() {
      vm.loadPortfolio();
      refreshInterval = $interval(function() {
        vm.loadPortfolio();
      }, 10000);
    };

    vm.loadPortfolio = function() {
      DashboardService.getPortfolio()
        .then(function(response) {
          vm.cards = response.cards;
          vm.lastUpdated = response.lastUpdated;
          vm.kpis = DataAggregationFactory.calculateKPIs(vm.cards);
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.loading = false;
          vm.error = 'Failed to load dashboard data. Please try again.';
          NotificationService.error('Failed to load dashboard data');
        });
    };

    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });

    vm.init();
  }
})();