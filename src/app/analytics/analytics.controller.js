(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionService', 'AnalyticsProcessorFactory', function($scope, TransactionService, AnalyticsProcessorFactory) {
      var vm = this;
      vm.categorySpending = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.chartData = {};
      function loadAnalyticsData() {
        vm.loading = true;
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        TransactionService.getMockTransactions().then(function(transactions) {
          var analytics = AnalyticsProcessorFactory.processAnalytics(transactions);
          vm.categorySpending = analytics.categorySpending;
          vm.monthlyTrends = analytics.monthlyTrends;
          vm.prepareChartData();
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      }
      loadAnalyticsData();
      vm.prepareChartData = function() {
        vm.chartData.categoryLabels = vm.categorySpending.map(function(c) { return c.category; });
        vm.chartData.categoryValues = vm.categorySpending.map(function(c) { return c.totalSpend; });
        vm.chartData.monthLabels = vm.monthlyTrends.map(function(m) { return m.month; });
        vm.chartData.monthValues = vm.monthlyTrends.map(function(m) { return m.totalSpend; });
      };
      vm.selectCategory = function(category) {
        vm.selectedCategory = category === vm.selectedCategory ? null : category;
      };
      vm.getCategoryPercentageWidth = function(percentage) {
        return {width: percentage + '%'};
      };
    }]);
})();