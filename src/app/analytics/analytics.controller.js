(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['AnalyticsService', 'TransactionService', '$scope'];
  function AnalyticsController(AnalyticsService, TransactionService, $scope) {
    var vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.categoryLabels = [];
    vm.categoryData = [];
    vm.categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
    vm.monthlyLabels = [];
    vm.monthlyData = [];
    vm.dateRange = {
      startDate: null,
      endDate: null
    };
    activate();
    function activate() {
      var endDate = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      vm.dateRange = {
        startDate: startDate,
        endDate: endDate
      };
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingAnalytics(vm.dateRange)
        .then(function(data) {
          vm.analyticsData = data;
          prepareChartData(data);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    function prepareChartData(data) {
      vm.categoryLabels = data.categorySpending.map(function(cat) {
        return cat.category;
      });
      vm.categoryData = data.categorySpending.map(function(cat) {
        return cat.amount;
      });
      vm.monthlyLabels = data.monthlyTrends.map(function(trend) {
        return trend.month;
      });
      vm.monthlyData = data.monthlyTrends.map(function(trend) {
        return trend.totalSpend;
      });
    }
  }
})();