(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', 'CategoryService', function($scope, $filter, AnalyticsService, CategoryService) {
      var vm = this;
      vm.categoryData = [];
      vm.trendData = [];
      vm.filter = {
        startDate: getDefaultStartDate(),
        endDate: getDefaultEndDate(),
        selectedCategories: [],
        cardId: null
      };
      vm.availableCategories = CategoryService.getCategories();
      vm.loading = false;
      vm.error = null;
      vm.applyFilter = applyFilter;
      vm.resetFilter = resetFilter;
      init();
      function init() {
        loadAnalyticsData();
      }
      function loadAnalyticsData() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingTrends(vm.filter)
          .then(function(trends) {
            vm.trendData = trends;
            return CategoryService.getCategorySpending(vm.filter);
          })
          .then(function(categoryData) {
            vm.categoryData = categoryData;
            calculatePercentages();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            console.error('Analytics load error:', error);
          });
      }
      function calculatePercentages() {
        var total = vm.categoryData.reduce(function(sum, cat) {
          return sum + cat.totalAmount;
        }, 0);
        vm.categoryData.forEach(function(cat) {
          cat.percentage = total > 0 ? (cat.totalAmount / total) * 100 : 0;
        });
      }
      function applyFilter() {
        loadAnalyticsData();
      }
      function resetFilter() {
        vm.filter = {
          startDate: getDefaultStartDate(),
          endDate: getDefaultEndDate(),
          selectedCategories: [],
          cardId: null
        };
        loadAnalyticsData();
      }
      function getDefaultStartDate() {
        var date = new Date();
        date.setMonth(date.getMonth() - 11);
        return date.toISOString().substring(0, 7);
      }
      function getDefaultEndDate() {
        return new Date().toISOString().substring(0, 7);
      }
    }]);
})();