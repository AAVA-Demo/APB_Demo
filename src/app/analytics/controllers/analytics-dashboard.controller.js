(function() {
  'use strict';
  angular.module('analytics')
    .controller('AnalyticsDashboardController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.analyticsData = null;
      vm.monthlyTrendsConfig = null;
      vm.cardWiseConfig = null;
      vm.categoryWiseConfig = null;
      vm.init = function() {
        const dateRange = { startDate: new Date('2023-11-01'), endDate: new Date('2024-01-31') };
        AnalyticsService.getSpendingAnalytics(dateRange)
          .then(function(data) {
            vm.analyticsData = data;
            vm.prepareChartConfigs();
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.prepareChartConfigs = function() {
        vm.monthlyTrendsConfig = {
          type: 'line',
          data: {
            labels: vm.analyticsData.monthlyTrends.map(m => m.month),
            datasets: [{
              label: 'Monthly Spend',
              data: vm.analyticsData.monthlyTrends.map(m => m.totalSpend),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        };
        vm.cardWiseConfig = {
          type: 'bar',
          data: {
            labels: vm.analyticsData.cardWiseSpending.map(c => c.cardName),
            datasets: [{
              label: 'Spending by Card',
              data: vm.analyticsData.cardWiseSpending.map(c => c.totalSpend),
              backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        };
        vm.categoryWiseConfig = {
          type: 'pie',
          data: {
            labels: vm.analyticsData.categoryWiseSpending.map(c => c.category),
            datasets: [{
              data: vm.analyticsData.categoryWiseSpending.map(c => c.amount),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        };
      };
      vm.init();
    }]);
})();