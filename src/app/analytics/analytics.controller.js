(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.loading = true;
    vm.filters = {
      selectedCard: 'all',
      selectedCategory: 'all',
      dateRange: {startDate: null, endDate: null},
      viewType: 'category'
    };
    vm.analyticsData = {};
    vm.categoryChartData = {};
    vm.monthlyChartData = {};
    vm.cardChartData = {};
    vm.loadAnalytics = function() {
      vm.loading = true;
      AnalyticsService.getSpendingAnalytics(vm.filters).then(function(data) {
        vm.analyticsData = data;
        vm.prepareCategoryChart();
        vm.prepareMonthlyChart();
        vm.prepareCardChart();
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        vm.error = 'Failed to load analytics data';
      });
    };
    vm.prepareCategoryChart = function() {
      var categories = vm.analyticsData.categories || [];
      var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
      vm.categoryChartData = {
        labels: categories.map(function(c) { return c.categoryName; }),
        data: categories.map(function(c) { return c.totalAmount; }),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {display: true, position: 'bottom'}
        }
      };
    };
    vm.prepareMonthlyChart = function() {
      var monthly = vm.analyticsData.monthlyTrends || [];
      vm.monthlyChartData = {
        labels: monthly.map(function(m) { return m.month; }),
        data: [monthly.map(function(m) { return m.totalSpend; })],
        series: ['Total Spend'],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{ticks: {beginAtZero: true}}]
          }
        }
      };
    };
    vm.prepareCardChart = function() {
      var cards = vm.analyticsData.cards || [];
      vm.cardChartData = {
        labels: cards.map(function(c) { return c.cardName; }),
        data: [cards.map(function(c) { return c.totalSpend; })],
        series: ['Card Spend'],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{ticks: {beginAtZero: true}}]
          }
        }
      };
    };
    vm.loadAnalytics();
  }]);
})();