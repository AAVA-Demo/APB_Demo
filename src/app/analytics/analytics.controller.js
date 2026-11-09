(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
      var vm = this;
      vm.insights = null;
      vm.loading = true;
      vm.error = null;
      vm.startDate = null;
      vm.endDate = null;
      vm.loadInsights = loadInsights;
      activate();
      function activate() {
        var today = new Date();
        var twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);
        vm.startDate = twelveMonthsAgo;
        vm.endDate = today;
        loadInsights();
      }
      function loadInsights() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingInsights(vm.startDate, vm.endDate)
          .then(function(data) {
            vm.insights = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            console.error('Error loading insights:', error);
          });
      }
    }]);
})();