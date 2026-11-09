(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.timeRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        endDate: new Date()
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.timeRange).then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics';
          vm.loading = false;
          console.error('Analytics load error:', error);
        });
      };
      vm.selectCategory = function(category) {
        vm.selectedCategory = category;
      };
      vm.clearCategoryFilter = function() {
        vm.selectedCategory = null;
      };
      vm.getFilteredTrends = function() {
        if (!vm.analyticsData || !vm.analyticsData.monthlyTrends) return [];
        if (!vm.selectedCategory) return vm.analyticsData.monthlyTrends;
        return vm.analyticsData.monthlyTrends.map(function(trend) {
          var filtered = angular.copy(trend);
          filtered.categoryBreakdown = trend.categoryBreakdown.filter(function(cat) {
            return cat.category === vm.selectedCategory;
          });
          filtered.totalSpend = filtered.categoryBreakdown.reduce(function(sum, cat) {
            return sum + cat.totalAmount;
          }, 0);
          return filtered;
        });
      };
      vm.loadAnalytics();
    }]);
})();