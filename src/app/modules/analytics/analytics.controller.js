(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionService', 'CategorizationService', 'KPIFactory', 'UserProfileService', function($scope, TransactionService, CategorizationService, KPIFactory, UserProfileService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.analytics = {};
      vm.chartData = null;
      vm.currentUser = UserProfileService.getCurrentUser();
      vm.dateRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        endDate: new Date()
      };
      vm.init = function() {
        vm.loadAnalytics();
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        TransactionService.getTransactions(vm.currentUser.userId, vm.dateRange.startDate, vm.dateRange.endDate)
          .then(function(transactions) {
            var categorized = CategorizationService.categorize(transactions);
            vm.analytics = {
              userId: vm.currentUser.userId,
              categories: categorized.categories,
              totalSpend: categorized.totalSpend,
              timePeriod: vm.dateRange
            };
            vm.prepareChartData();
            return KPIFactory.getConsolidatedMetrics(vm.currentUser.userId);
          })
          .then(function(metrics) {
            vm.consolidatedMetrics = metrics;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            toastr.error('Failed to load analytics');
          });
      };
      vm.prepareChartData = function() {
        var labels = [];
        var data = [];
        var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
        vm.analytics.categories.forEach(function(cat) {
          if (cat.totalSpend > 0) {
            labels.push(cat.categoryName);
            data.push(cat.totalSpend);
          }
        });
        vm.chartData = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors.slice(0, labels.length)
          }]
        };
      };
      vm.formatCurrency = function(value) {
        return '$' + (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.init();
    }]);
})();