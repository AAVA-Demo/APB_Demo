(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
      var vm = this;
      vm.analyticsData = {};
      vm.loading = true;
      vm.selectedPeriod = 6;
      vm.init = function() {
        vm.applyFilter();
      };
      vm.applyFilter = function() {
        vm.loading = true;
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(endDate.getMonth() - vm.selectedPeriod);
        AnalyticsService.getSpendingInsights(startDate, endDate).then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
          vm.renderCharts();
          $scope.$apply();
        }).catch(function(error) {
          console.error('Error loading analytics:', error);
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.renderCharts = function() {
        if (vm.analyticsData.monthlyTrends && vm.analyticsData.monthlyTrends.length > 0) {
          vm.monthlyTrendChartData = {
            labels: vm.analyticsData.monthlyTrends.map(function(t) { return t.month; }),
            data: vm.analyticsData.monthlyTrends.map(function(t) { return t.totalSpend; })
          };
        }
        if (vm.analyticsData.categorySpends && vm.analyticsData.categorySpends.length > 0) {
          vm.categoryChartData = {
            labels: vm.analyticsData.categorySpends.map(function(c) { return c.category; }),
            data: vm.analyticsData.categorySpends.map(function(c) { return c.totalSpend; })
          };
        }
        if (vm.analyticsData.cardWiseSpends && vm.analyticsData.cardWiseSpends.length > 0) {
          vm.cardWiseChartData = {
            labels: vm.analyticsData.cardWiseSpends.map(function(c) { return c.cardName; }),
            data: vm.analyticsData.cardWiseSpends.map(function(c) { return c.totalSpend; })
          };
        }
      };
      vm.init();
    }]);
})();