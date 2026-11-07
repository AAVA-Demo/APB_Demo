(function() {
  'use strict';
  angular.module('ccAnalyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', 'CategoryService', function($scope, AnalyticsService, CategoryService) {
    var vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.error = null;
    vm.selectedCategory = null;
    vm.categoryDetails = [];
    vm.init = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics = function() {
      vm.loading = true;
      AnalyticsService.getSpendingAnalytics().then(function(analytics) {
        vm.analytics = analytics;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
      });
    };
    vm.onCategorySelected = function(category) {
      vm.selectedCategory = category;
      AnalyticsService.getTransactionsByCategory(category).then(function(response) {
        vm.categoryDetails = response.data;
      });
    };
    $scope.$on('category:selected', function(event, category) {
      vm.onCategorySelected(category);
    });
    vm.init();
  }]);
})();