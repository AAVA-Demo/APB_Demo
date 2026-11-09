(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['$scope', 'AnalyticsService', '$q'];
  function AnalyticsController($scope, AnalyticsService, $q) {
    var vm = this;
    vm.trendData = [];
    vm.categoryData = [];
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.selectedCategory = null;
    vm.loading = true;
    vm.error = null;
    vm.drillDown = function(category) {
      vm.selectedCategory = category;
      vm.filteredTransactions = vm.transactions.filter(function(t) {
        return t.category === category;
      });
    };
    vm.clearDrillDown = function() {
      vm.selectedCategory = null;
      vm.filteredTransactions = [];
    };
    function init() {
      $q.all([
        AnalyticsService.getMonthlyTrends(),
        AnalyticsService.getCategoryBreakdown(),
        AnalyticsService.getTransactions()
      ])
      .then(function(results) {
        vm.trendData = results[0];
        vm.categoryData = results[1];
        vm.transactions = results[2];
        vm.loading = false;
        renderCharts();
      })
      .catch(function(err) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
      });
    }
    function renderCharts() {
      $scope.$broadcast('renderTrendChart', vm.trendData);
      $scope.$broadcast('renderCategoryChart', vm.categoryData);
    }
    init();
  }
})();