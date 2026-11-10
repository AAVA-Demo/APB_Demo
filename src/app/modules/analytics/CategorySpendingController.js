(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('CategorySpendingController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
      const vm = this;
      vm.categoryData = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.filterCategory = function(category) {
        vm.selectedCategory = category;
      };
      vm.clearFilter = function() {
        vm.selectedCategory = null;
      };
      AnalyticsService.getCategorySpending()
        .then(function(data) {
          vm.categoryData = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
    }]);
})();