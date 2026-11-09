(function() {
  'use strict';
  angular.module('cc.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', AnalyticsController]);
  function AnalyticsController($scope, AnalyticsService) {
    var vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.selectedCategory = null;
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingAnalytics(12)
        .then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Unable to load analytics data. Please try again.';
          vm.loading = false;
        });
    };
    vm.filterByCategory = function(category) {
      vm.selectedCategory = category;
    };
    vm.loadAnalytics();
  }
})();