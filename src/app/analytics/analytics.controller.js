(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.categorySpends = [];
      vm.monthlyTrends = [];
      vm.cardSpends = [];
      vm.loading = true;
      vm.error = null;
      vm.categoryChartData = [];
      vm.categoryChartLabels = [];
      vm.monthlyChartData = [];
      vm.monthlyChartLabels = [];
      vm.cardChartData = [];
      vm.cardChartLabels = [];
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.loadAnalytics().then(function(data) {
          vm.categorySpends = data.categorySpends;
          vm.monthlyTrends = data.monthlyTrends;
          vm.cardSpends = data.cardSpends;
          vm.categoryChartData = vm.categorySpends.map(function(c) { return c.totalAmount; });
          vm.categoryChartLabels = vm.categorySpends.map(function(c) { return c.category; });
          vm.monthlyChartData = vm.monthlyTrends.map(function(m) { return m.totalSpend; });
          vm.monthlyChartLabels = vm.monthlyTrends.map(function(m) { return m.month; });
          vm.cardChartData = vm.cardSpends.map(function(c) { return c.totalSpend; });
          vm.cardChartLabels = vm.cardSpends.map(function(c) { return c.cardName; });
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
          console.error(error);
        });
      }
      loadAnalytics();
    }]);
  AnalyticsController.$inject = ['$scope', 'AnalyticsService'];
})();