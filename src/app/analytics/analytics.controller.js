(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['$scope', '$filter', '$location', 'AnalyticsService', 'CategoryService', 'ChartConfigService'];
  function AnalyticsController($scope, $filter, $location, AnalyticsService, CategoryService, ChartConfigService) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.categoryData = [];
    vm.trendData = [];
    vm.cardComparisonData = [];
    vm.categories = [];
    vm.filter = {
      dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      dateTo: new Date(),
      cardIds: []
    };
    vm.categoryChartConfig = null;
    vm.trendChartConfig = null;
    vm.cardChartConfig = null;
    vm.applyFilter = applyFilter;
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      CategoryService.getCategories()
        .then(function(categories) {
          vm.categories = categories;
          return AnalyticsService.getCategorySpend(vm.filter);
        })
        .then(function(categoryData) {
          vm.categoryData = categoryData;
          return AnalyticsService.getMonthlyTrends(vm.filter);
        })
        .then(function(trendData) {
          vm.trendData = trendData;
          return AnalyticsService.getCardComparison(vm.filter);
        })
        .then(function(cardData) {
          vm.cardComparisonData = cardData;
          prepareChartConfigs();
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    function prepareChartConfigs() {
      vm.categoryChartConfig = ChartConfigService.generateDonutConfig(vm.categoryData, function(category) {
        $location.path('/transactions').search({category: category});
        $scope.$apply();
      });
      vm.trendChartConfig = ChartConfigService.generateLineConfig(vm.trendData);
      vm.cardChartConfig = ChartConfigService.generateBarConfig(vm.cardComparisonData);
    }
    function applyFilter() {
      loadAnalytics();
    }
  }
})();