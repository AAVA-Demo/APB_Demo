(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['$scope', 'AnalyticsService', 'ChartService', 'CategoryService'];
  function AnalyticsController($scope, AnalyticsService, ChartService, CategoryService) {
    var vm = this;
    vm.categorySpendData = [];
    vm.monthlyTrendData = [];
    vm.cardWiseData = [];
    vm.pieChartConfig = {};
    vm.lineChartConfig = {};
    vm.barChartConfig = {};
    vm.filter = {
      cardIds: [],
      categories: [],
      startDate: null,
      endDate: null
    };
    vm.availableCategories = CategoryService.getCategories();
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      var sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      vm.filter.startDate = sixMonthsAgo.toISOString().split('T')[0];
      vm.filter.endDate = new Date().toISOString().split('T')[0];
      vm.loadAnalytics();
      $scope.$watch('vm.filter', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          vm.loadAnalytics();
        }
      }, true);
    };
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingAnalytics(vm.filter).then(function(data) {
        vm.categorySpendData = data.categorySpends || [];
        vm.monthlyTrendData = data.monthlyTrends || [];
        vm.cardWiseData = data.cardWiseSpends || [];
        vm.pieChartConfig = ChartService.generateChartConfig(vm.categorySpendData, 'pie');
        vm.lineChartConfig = ChartService.generateChartConfig(vm.monthlyTrendData, 'line');
        vm.barChartConfig = ChartService.generateChartConfig(vm.cardWiseData, 'bar');
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
      });
    };
    vm.applyFilter = function() {
      vm.loadAnalytics();
    };
    vm.clearFilter = function() {
      vm.filter = {
        cardIds: [],
        categories: [],
        startDate: null,
        endDate: null
      };
      var sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      vm.filter.startDate = sixMonthsAgo.toISOString().split('T')[0];
      vm.filter.endDate = new Date().toISOString().split('T')[0];
      vm.loadAnalytics();
    };
    vm.init();
  }
})();