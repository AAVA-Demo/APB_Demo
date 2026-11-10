(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'AnalyticsDataFactory', 'AuthService', 'toastr', function($scope, AnalyticsService, AnalyticsDataFactory, AuthService, toastr) {
      const vm = this;
      vm.spendingData = null;
      vm.categoryChartData = null;
      vm.trendChartData = null;
      vm.loading = true;
      vm.selectedCategory = null;
      const user = AuthService.getCurrentUser();
      const userId = user.userId;
      vm.loadAnalytics = function() {
        AnalyticsService.getSpendingData(userId, 12)
          .then(function(data) {
            vm.spendingData = data;
            vm.categoryChartData = AnalyticsDataFactory.transformCategoryData(data.categoryBreakdown);
            vm.trendChartData = AnalyticsDataFactory.transformTrendData(data.monthlyTrends);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load analytics data');
          });
      };
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category;
        const filtered = vm.spendingData.monthlyTrends.map(function(month) {
          const catData = month.categories.find(function(c) { return c.category === category; });
          return {
            monthYear: month.monthYear,
            amount: catData ? catData.amount : 0
          };
        });
        vm.trendChartData = AnalyticsDataFactory.transformTrendData(filtered);
      };
      vm.resetFilter = function() {
        vm.selectedCategory = null;
        vm.trendChartData = AnalyticsDataFactory.transformTrendData(vm.spendingData.monthlyTrends);
      };
      vm.loadAnalytics();
    }]);
})();