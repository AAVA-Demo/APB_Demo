(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
    const vm = this;
    vm.loading = true;
    vm.analyticsData = null;
    vm.activeTab = 'category';
    vm.init = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics = function() {
      vm.loading = true;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.loading = false;
        console.error('Error loading analytics:', error);
        $scope.$apply();
      });
    };
    vm.setActiveTab = function(tab) {
      vm.activeTab = tab;
    };
    vm.init();
  }]);
})();