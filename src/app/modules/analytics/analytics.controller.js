(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionService', 'CategorizationService', 'AnalyticsEngineService', 'ChartService', function($scope, TransactionService, CategorizationService, AnalyticsEngineService, ChartService) {
      var vm = this;
      vm.transactions = [];
      vm.categorySpend = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.categoryChartData = {};
      vm.trendChartData = {};
      function init() {
        loadAnalyticsData();
      }
      function loadAnalyticsData() {
        TransactionService.getTransactions()
          .then(function(transactions) {
            vm.transactions = CategorizationService.categorizeAll(transactions);
            vm.categorySpend = AnalyticsEngineService.aggregateByCategory(vm.transactions);
            vm.monthlyTrends = AnalyticsEngineService.aggregateByMonth(vm.transactions);
            vm.categoryChartData = ChartService.prepareCategoryChart(vm.categorySpend);
            vm.trendChartData = ChartService.prepareTrendChart(vm.monthlyTrends);
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
          });
      }
      vm.onCategoryClick = function(points, evt) {
        if (points && points.length > 0) {
          var index = points[0]._index;
          vm.selectedCategory = vm.categorySpend[index].category;
          var filtered = vm.transactions.filter(function(t) {
            return t.category === vm.selectedCategory;
          });
          $scope.$apply();
        }
      };
      vm.clearFilter = function() {
        vm.selectedCategory = null;
      };
      init();
    }]);
})();