(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'FinancialAggregationService', 'AuthService', function($scope, $interval, CreditCardService, FinancialAggregationService, AuthService) {
      var vm = this;
      vm.cards = [];
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      function init() {
        loadDashboardData();
        var refreshInterval = $interval(function() {
          loadDashboardData();
        }, 10000);
        $scope.$on('$destroy', function() {
          $interval.cancel(refreshInterval);
        });
      }
      function loadDashboardData() {
        if (!AuthService.isAuthenticated()) {
          vm.error = 'Authentication required';
          vm.loading = false;
          return;
        }
        CreditCardService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.kpis = FinancialAggregationService.aggregateKPIs(cards);
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
          });
      }
      init();
    }]);
})();