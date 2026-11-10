(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsService', 'CategoryService', '$scope', function(AnalyticsService, CategoryService, $scope) {
      const vm = this;
      vm.analytics = null;
      vm.loading = true;
      vm.filter = {
        startDate: null,
        endDate: null,
        selectedCategories: []
      };
      vm.categories = CategoryService.getCategories();
      vm.pieChartLabels = [];
      vm.pieChartData = [];
      vm.lineChartLabels = [];
      vm.lineChartData = [];
      vm.loadAnalytics = function() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.filter).then(function(data) {
          vm.analytics = data;
          vm.pieChartLabels = data.categorySpending.map(c => c.category);
          vm.pieChartData = data.categorySpending.map(c => c.amount);
          vm.lineChartLabels = data.monthlyTrends.map(m => m.month);
          vm.lineChartData = data.monthlyTrends.map(m => m.totalSpend);
          vm.loading = false;
        }).catch(function(error) {
          console.error('Error loading analytics:', error);
          vm.loading = false;
        });
      };
      vm.applyFilter = function() {
        vm.loadAnalytics();
      };
      vm.loadAnalytics();
    }]);
})();