(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .controller('InsightsController', ['$scope', '$filter', 'DataAnalyticsEngineService', function($scope, $filter, DataAnalyticsEngineService) {
      var vm = this;
      vm.categoryInsights = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedPeriod = '12months';
      function loadInsights() {
        vm.loading = true;
        DataAnalyticsEngineService.getInsights(vm.selectedPeriod).then(function(data) {
          vm.categoryInsights = data.categoryInsights;
          vm.monthlyTrends = data.monthlyTrends;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load insights.';
          vm.loading = false;
        });
      }
      vm.changePeriod = function(period) {
        vm.selectedPeriod = period;
        loadInsights();
      };
      loadInsights();
    }]);
})();