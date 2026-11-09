(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', 'KPIAggregationService', function($scope, KPIAggregationService) {
      const vm = this;
      vm.loading = true;
      vm.kpis = {};
      vm.cards = [];
      vm.error = null;
      
      vm.init = function() {
        KPIAggregationService.getKPIs()
          .then(function(response) {
            vm.kpis = response.kpis;
            vm.cards = response.cards;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            console.error('Dashboard load error:', error);
            $scope.$apply();
          });
      };
      
      vm.init();
    }]);
})();