(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsService', 'CategoryService', '$scope', function(AnalyticsService, CategoryService, $scope) {
      var vm = this;
      vm.spendingData = null;
      vm.categoryChartData = null;
      vm.trendChartData = null;
      vm.loading = true;
      vm.error = null;
      vm.userId = 'user123';
      vm.dateRange = {
        startMonth: null,
        endMonth: null
      };
      vm.selectedCategory = null;
      vm.categories = CategoryService.getCategories();

      vm.initializeDateRange = function() {
        var now = new Date();
        vm.dateRange.endMonth = now.toISOString().slice(0, 7);
        var startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        vm.dateRange.startMonth = startDate.toISOString().slice(0, 7);
      };

      vm.loadSpendingInsights = function() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingInsights(vm.userId, vm.dateRange)
          .then(function(data) {
            vm.spendingData = data;
            vm.prepareCategoryChart();
            vm.prepareTrendChart();
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            console.error('Analytics error:', err);
          });
      };

      vm.prepareCategoryChart = function() {
        vm.categoryChartData = {
          labels: vm.spendingData.categorySpending.map(c => c.category),
          data: vm.spendingData.categorySpending.map(c => c.totalAmount),
          percentages: vm.spendingData.categorySpending.map(c => c.percentage)
        };
      };

      vm.prepareTrendChart = function() {
        var trends = vm.selectedCategory ? 
          vm.spendingData.monthlyTrends.map(m => ({
            month: m.month,
            amount: m.categoryBreakdown[vm.selectedCategory] || 0
          })) :
          vm.spendingData.monthlyTrends.map(m => ({
            month: m.month,
            amount: m.totalSpend
          }));
        vm.trendChartData = {
          labels: trends.map(t => t.month),
          data: trends.map(t => t.amount)
        };
      };

      vm.onDateRangeChange = function(startMonth, endMonth) {
        vm.dateRange.startMonth = startMonth;
        vm.dateRange.endMonth = endMonth;
        vm.loadSpendingInsights();
      };

      vm.onCategoryDrillDown = function(category) {
        vm.selectedCategory = category;
        vm.prepareTrendChart();
      };

      vm.clearCategoryFilter = function() {
        vm.selectedCategory = null;
        vm.prepareTrendChart();
      };

      vm.initializeDateRange();
      vm.loadSpendingInsights();
    }]);
})();