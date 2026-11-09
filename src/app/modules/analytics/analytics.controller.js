(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', 'AnalyticsDataService', 'AuthService', function($scope, AnalyticsDataService, AuthService) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedMonths = 12;
      vm.categoryChartData = null;
      vm.monthlyChartData = null;
      vm.cardWiseChartData = null;
      function loadAnalytics() {
        var userId = AuthService.getUserId();
        vm.loading = true;
        vm.error = null;
        AnalyticsDataService.getSpendingAnalytics(userId, vm.selectedMonths)
          .then(function(data) {
            vm.analyticsData = data;
            prepareCategoryChart(data.categoryBreakdown);
            prepareMonthlyChart(data.monthlyTrend);
            prepareCardWiseChart(data.cardWiseSpend);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            console.error('Analytics error:', error);
          });
      }
      function prepareCategoryChart(categoryBreakdown) {
        if (!categoryBreakdown || categoryBreakdown.length === 0) {
          vm.categoryChartData = null;
          return;
        }
        vm.categoryChartData = {
          labels: categoryBreakdown.map(function(c) { return c.category; }),
          datasets: [{
            data: categoryBreakdown.map(function(c) { return c.amount; }),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
            ]
          }]
        };
      }
      function prepareMonthlyChart(monthlyTrend) {
        if (!monthlyTrend || monthlyTrend.length === 0) {
          vm.monthlyChartData = null;
          return;
        }
        vm.monthlyChartData = {
          labels: monthlyTrend.map(function(m) { return m.month; }),
          datasets: [{
            label: 'Monthly Spend',
            data: monthlyTrend.map(function(m) { return m.totalSpend; }),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true
          }]
        };
      }
      function prepareCardWiseChart(cardWiseSpend) {
        if (!cardWiseSpend || cardWiseSpend.length === 0) {
          vm.cardWiseChartData = null;
          return;
        }
        vm.cardWiseChartData = {
          labels: cardWiseSpend.map(function(c) { return c.cardName; }),
          datasets: [{
            label: 'Card-wise Spend',
            data: cardWiseSpend.map(function(c) { return c.totalSpend; }),
            backgroundColor: '#4BC0C0'
          }]
        };
      }
      vm.updateDateRange = function() {
        AnalyticsDataService.clearCache();
        loadAnalytics();
      };
      loadAnalytics();
    }]);
})();