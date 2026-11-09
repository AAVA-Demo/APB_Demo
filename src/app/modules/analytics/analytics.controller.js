(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsEngineService', function($scope, $filter, AnalyticsEngineService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.categoryData = [];
      vm.monthlyData = [];
      vm.cardData = [];
      vm.filters = {
        timeRange: 'all',
        cardId: ''
      };
      
      vm.loadAnalytics = function() {
        vm.loading = true;
        AnalyticsEngineService.getSpendingAnalytics(vm.filters)
          .then(function(response) {
            vm.categoryData = response.categoryData;
            vm.monthlyData = response.monthlyData;
            vm.cardData = response.cardData;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            console.error('Analytics load error:', error);
            $scope.$apply();
          });
      };
      
      vm.refreshAnalytics = function() {
        vm.loadAnalytics();
      };
      
      vm.loadAnalytics();
    }]);
})();