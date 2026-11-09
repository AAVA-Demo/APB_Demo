(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', function($scope, $filter, AnalyticsService) {
      var vm = this;
      vm.analytics = {};
      vm.loading = true;
      vm.error = null;
      vm.dateRange = {
        start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        end: new Date()
      };

      vm.init = function() {
        vm.loadAnalytics();
      };

      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingData(vm.dateRange).then(function(data) {
          vm.analytics = data;
          vm.loading = false;
          vm.renderCharts();
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      };

      vm.renderCharts = function() {
        $scope.$broadcast('renderCharts', vm.analytics);
      };

      vm.refresh = function() {
        AnalyticsService.clearCache();
        vm.loadAnalytics();
      };

      vm.init();
    }]);
})();