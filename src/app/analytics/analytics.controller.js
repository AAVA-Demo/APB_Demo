(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', function($scope, $filter, AnalyticsService) {
      var vm = this;
      vm.spending = null;
      vm.loading = true;
      vm.error = null;
      vm.dateRange = 'last12months';
      vm.refresh = refresh;
      init();
      function init() {
        loadSpendingData();
      }
      function loadSpendingData() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingData(vm.dateRange)
          .then(function(data) {
            vm.spending = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load spending analytics. Please try again.';
            vm.loading = false;
          });
      }
      function refresh() {
        loadSpendingData();
      }
    }]);
})();