(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', AnalyticsController]);
  function AnalyticsController($scope, AnalyticsService) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.monthlyTrends = [];
    vm.categoryBreakdown = [];
    vm.cardWiseSpend = [];
    vm.selectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.dateRange = { start: getMonthsAgo(6), end: getCurrentMonth() };
    function getMonthsAgo(months) {
      var d = new Date();
      d.setMonth(d.getMonth() - months);
      return d.toISOString().substr(0, 7);
    }
    function getCurrentMonth() {
      return new Date().toISOString().substr(0, 7);
    }
    vm.init = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics = function() {
      vm.loading = true;
      AnalyticsService.getSpendingAnalytics(vm.dateRange.start, vm.dateRange.end).then(function(data) {
        vm.monthlyTrends = data.monthlyTrends;
        vm.categoryBreakdown = data.categoryBreakdown;
        vm.cardWiseSpend = data.cardWiseSpend;
        vm.updateCharts();
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data.';
        vm.loading = false;
      });
    };
    vm.updateCharts = function() {
      vm.trendLabels = vm.monthlyTrends.map(function(t) { return t.month; });
      vm.trendData = [vm.monthlyTrends.map(function(t) { return t.totalSpend; })];
      vm.trendSeries = ['Monthly Spend'];
      var filtered = vm.categoryBreakdown.filter(function(c) { return vm.selectedCategories.indexOf(c.category) !== -1; });
      vm.categoryLabels = filtered.map(function(c) { return c.category; });
      vm.categoryData = filtered.map(function(c) { return c.amount; });
      vm.cardLabels = vm.cardWiseSpend.map(function(c) { return c.cardName; });
      vm.cardData = vm.cardWiseSpend.map(function(c) { return c.totalSpend; });
    };
    vm.onCategoryChange = function() {
      vm.updateCharts();
    };
    vm.init();
  }
})();