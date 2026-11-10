(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.categoryData = [];
      vm.trendData = [];
      vm.loading = true;
      vm.error = null;
      vm.categoryChartData = null;
      vm.trendChartData = null;
      vm.init = function() {
        AnalyticsService.getCategorySpending()
          .then(function(categories) {
            vm.categoryData = categories;
            vm.categoryChartData = {
              labels: categories.map(function(c) { return c.category; }),
              data: categories.map(function(c) { return c.amount; }),
              type: 'pie'
            };
            return AnalyticsService.getMonthlyTrends();
          })
          .then(function(trends) {
            vm.trendData = trends;
            vm.trendChartData = {
              labels: trends.map(function(t) { return t.month; }),
              data: trends.map(function(t) { return t.totalSpend; }),
              type: 'line'
            };
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
          });
      };
      vm.init();
    }]);
})();