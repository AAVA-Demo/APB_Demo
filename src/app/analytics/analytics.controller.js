(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', function($scope, $filter, AnalyticsService) {
      var vm = this;
      vm.categoryBreakdown = {};
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = '';
      vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.getCategorySpending().then(function(data) {
          vm.categoryBreakdown = data;
          return AnalyticsService.getMonthlyTrends();
        }).then(function(trends) {
          vm.monthlyTrends = trends;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
          console.error('Analytics load error:', error);
        });
      }
      loadAnalytics();
      vm.getCategoryKeys = function() {
        return Object.keys(vm.categoryBreakdown);
      };
      vm.applyFilter = function() {
        if (vm.selectedCategory) {
          var filtered = {};
          filtered[vm.selectedCategory] = vm.categoryBreakdown[vm.selectedCategory];
          vm.filteredBreakdown = filtered;
        } else {
          vm.filteredBreakdown = vm.categoryBreakdown;
        }
      };
      vm.applyFilter();
      $scope.$watch('vm.selectedCategory', function() {
        vm.applyFilter();
      });
    }]);
})();