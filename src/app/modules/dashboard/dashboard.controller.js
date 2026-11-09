(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', 'CreditCardService', 'AuthService', function($scope, $interval, KPIService, CreditCardService, AuthService) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      var refreshInterval;
      function loadDashboardData() {
        var userId = AuthService.getUserId();
        vm.loading = true;
        vm.error = null;
        KPIService.getKPIs(userId)
          .then(function(kpiData) {
            vm.kpis = kpiData;
            return CreditCardService.getCards(userId);
          })
          .then(function(cardsData) {
            vm.cards = cardsData;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
            console.error('Dashboard error:', error);
          });
      }
      loadDashboardData();
      refreshInterval = $interval(function() {
        KPIService.clearCache();
        loadDashboardData();
      }, 300000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.refresh = function() {
        KPIService.clearCache();
        CreditCardService.clearCache && CreditCardService.clearCache();
        loadDashboardData();
      };
    }]);
})();