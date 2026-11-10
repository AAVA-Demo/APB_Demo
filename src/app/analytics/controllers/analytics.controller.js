(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'ChartDataService', function($scope, AnalyticsService, ChartDataService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.monthlyTrendsData = null;
      vm.categoryBreakdownData = null;
      vm.cardWiseSpendData = null;
      vm.dateRange = {
        start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        end: new Date()
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        var startDate = vm.dateRange.start.toISOString().split('T')[0];
        var endDate = vm.dateRange.end.toISOString().split('T')[0];
        AnalyticsService.getMonthlyTrends(startDate, endDate)
          .then(function(data) {
            vm.monthlyTrendsData = ChartDataService.transformMonthlyTrends(data);
          })
          .catch(function(error) {
            vm.error = 'Failed to load monthly trends.';
          });
        AnalyticsService.getCategoryBreakdown(startDate, endDate)
          .then(function(data) {
            vm.categoryBreakdownData = ChartDataService.transformCategoryBreakdown(data);
          })
          .catch(function(error) {
            vm.error = 'Failed to load category breakdown.';
          });
        AnalyticsService.getCardWiseSpend(startDate, endDate)
          .then(function(data) {
            vm.cardWiseSpendData = ChartDataService.transformCardWiseSpend(data);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card-wise spend.';
            vm.loading = false;
          });
      };
      vm.loadAnalytics();
    }]);
})();