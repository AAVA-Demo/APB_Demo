(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'AuthService', function($scope, AnalyticsService, AuthService) {
      var vm = this;
      vm.insights = null;
      vm.loading = true;
      vm.selectedCategory = 'All';
      vm.categories = ['All', 'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      vm.categoryChartLabels = [];
      vm.categoryChartData = [];
      vm.trendChartLabels = [];
      vm.trendChartData = [[]];
      vm.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: true }
      };
      function loadAnalytics() {
        vm.loading = true;
        var userId = AuthService.getUserId();
        AnalyticsService.getSpendingInsights(userId, 12).then(function(data) {
          vm.insights = data;
          updateCharts(data);
          vm.loading = false;
        }).catch(function(error) {
          vm.loading = false;
          alert('Failed to load analytics');
        });
      }
      function updateCharts(data) {
        vm.categoryChartLabels = data.categoryBreakdown.map(function(item) { return item.category; });
        vm.categoryChartData = data.categoryBreakdown.map(function(item) { return item.total; });
        vm.trendChartLabels = data.monthlyTrends.map(function(item) { return item.month; });
        vm.trendChartData = [data.monthlyTrends.map(function(item) { return item.total; })];
      }
      vm.filterByCategory = function() {
        if (vm.selectedCategory === 'All') {
          updateCharts(vm.insights);
        } else {
          var filtered = AnalyticsService.filterByCategory(vm.insights, vm.selectedCategory);
          updateCharts(filtered);
        }
      };
      loadAnalytics();
    }]);
})();