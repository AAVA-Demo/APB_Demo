(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.spendingData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.dateRange = {
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date()
      };
      vm.updateFilters = function() {
        loadSpendingData();
      };
      vm.selectCategory = function(category) {
        vm.selectedCategory = category;
      };
      function loadSpendingData() {
        vm.loading = true;
        AnalyticsService.getSpendingData(vm.dateRange).then(function(data) {
          vm.spendingData = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
      }
      loadSpendingData();
    }]);
  AnalyticsController.$inject = ['$scope', 'AnalyticsService'];
})();