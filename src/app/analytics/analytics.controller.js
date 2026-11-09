(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'CategoryFilterFactory', 'AuthService', function($scope, AnalyticsService, CategoryFilterFactory, AuthService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.spendingData = null;
      vm.filters = CategoryFilterFactory.getFilters();
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        var userId = AuthService.getUserId();
        AnalyticsService.getSpendingData(userId, vm.filters)
          .then(function(data) {
            vm.spendingData = data;
            vm.prepareCategoryChart();
            vm.prepareMonthlyChart();
            vm.prepareCardChart();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            console.error(error);
          });
      };
      vm.applyFilters = function() {
        CategoryFilterFactory.setFilters(vm.filters);
        vm.loadAnalytics();
      };
      vm.prepareCategoryChart = function() {
        if (!vm.spendingData || !vm.spendingData.categorySpending) return;
        vm.categoryLabels = vm.spendingData.categorySpending.map(function(c) { return c.category; });
        vm.categoryData = vm.spendingData.categorySpending.map(function(c) { return c.amount; });
        vm.categoryOptions = {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true, position: 'bottom' }
        };
      };
      vm.prepareMonthlyChart = function() {
        if (!vm.spendingData || !vm.spendingData.monthlyTrends) return;
        vm.monthlyLabels = vm.spendingData.monthlyTrends.map(function(m) { return m.month; });
        vm.monthlyData = [vm.spendingData.monthlyTrends.map(function(m) { return m.totalSpend; })];
        vm.monthlySeries = ['Total Spend'];
        vm.monthlyOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        };
      };
      vm.prepareCardChart = function() {
        if (!vm.spendingData || !vm.spendingData.cardWiseSpending) return;
        vm.cardLabels = vm.spendingData.cardWiseSpending.map(function(c) { return c.cardName; });
        vm.cardData = vm.spendingData.cardWiseSpending.map(function(c) { return c.totalSpend; });
        vm.cardOptions = {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true, position: 'bottom' }
        };
      };
      vm.loadAnalytics();
    }]);
})();