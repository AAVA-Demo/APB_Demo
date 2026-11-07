(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsDashboardController', ['$scope', '$q', 'AnalyticsService', 'AuthService', 'CategoryMapper', function($scope, $q, AnalyticsService, AuthService, CategoryMapper) {
      const vm = this;
      vm.loading = true;
      vm.analytics = null;
      vm.selectedDateRange = '12months';
      vm.categories = CategoryMapper.getCategories();
      const userId = AuthService.getUserId();
      function loadAnalytics() {
        vm.loading = true;
        const dateRange = getDateRangeFromSelection(vm.selectedDateRange);
        AnalyticsService.getSpendingAnalytics(userId, dateRange)
          .then(function(data) {
            vm.analytics = data;
            vm.loading = false;
            $scope.$applyAsync(function() {
              renderCharts();
            });
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load analytics data');
          });
      }
      loadAnalytics();
      vm.changeDateRange = function() {
        loadAnalytics();
      };
      function getDateRangeFromSelection(selection) {
        const endDate = new Date();
        const startDate = new Date();
        switch(selection) {
          case '3months':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case '6months':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
          case '12months':
          default:
            startDate.setMonth(startDate.getMonth() - 12);
        }
        return { startDate: startDate, endDate: endDate };
      }
      function renderCharts() {
        if (!vm.analytics) return;
        renderCategoryChart();
        renderMonthlyTrendChart();
        renderCardWiseChart();
      }
      function renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;
        const labels = vm.analytics.categoryBreakdown.map(function(c) { return c.category; });
        const data = vm.analytics.categoryBreakdown.map(function(c) { return c.amount; });
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'right' },
            title: { display: true, text: 'Category-wise Spending' }
          }
        });
      }
      function renderMonthlyTrendChart() {
        const ctx = document.getElementById('monthlyTrendChart');
        if (!ctx) return;
        const labels = vm.analytics.monthlyTrends.map(function(m) { return m.month; });
        const data = vm.analytics.monthlyTrends.map(function(m) { return m.totalSpend; });
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monthly Spend',
              data: data,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{ ticks: { beginAtZero: true, callback: function(value) { return '$' + value; } } }]
            },
            title: { display: true, text: 'Monthly Spend Trend' }
          }
        });
      }
      function renderCardWiseChart() {
        const ctx = document.getElementById('cardWiseChart');
        if (!ctx) return;
        const labels = vm.analytics.cardWiseAnalysis.map(function(c) { return c.cardName; });
        const data = vm.analytics.cardWiseAnalysis.map(function(c) { return c.totalSpend; });
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Spend by Card',
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{ ticks: { beginAtZero: true, callback: function(value) { return '$' + value; } } }]
            },
            title: { display: true, text: 'Card-wise Spend Analysis' }
          }
        });
      }
    }]);
})();