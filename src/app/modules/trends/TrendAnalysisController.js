(function() {
  'use strict';
  angular.module('creditCard.trends')
    .controller('TrendAnalysisController', ['TrendAnalysisService', '$scope', '$filter', function(TrendAnalysisService, $scope, $filter) {
      const vm = this;
      vm.trendData = null;
      vm.loading = true;
      vm.error = null;
      vm.dateRange = {
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        endDate: new Date()
      };
      vm.selectedCards = [];
      function loadTrendData() {
        vm.loading = true;
        const dateRange = {
          startDate: $filter('date')(vm.dateRange.startDate, 'yyyy-MM-dd'),
          endDate: $filter('date')(vm.dateRange.endDate, 'yyyy-MM-dd')
        };
        TrendAnalysisService.getTrendData(dateRange, vm.selectedCards)
          .then(function(data) {
            vm.trendData = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load trend data';
            vm.loading = false;
          });
      }
      vm.updateDateRange = function() {
        loadTrendData();
      };
      loadTrendData();
    }]);
})();