(function() {
  'use strict';
  angular.module('creditCardApp').controller('analyticsController', ['$scope', '$filter', 'analyticsService', function($scope, $filter, analyticsService) {
    var vm = this;
    vm.analyticsData = null;
    vm.selectedMonth = null;
    vm.selectedCategory = null;
    vm.categoryTransactions = [];
    vm.loading = true;
    vm.error = null;
    vm.months = [];
    function initMonths() {
      var currentDate = new Date();
      for (var i = 0; i < 6; i++) {
        var month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        vm.months.push($filter('date')(month, 'yyyy-MM'));
      }
      vm.selectedMonth = vm.months[0];
    }
    function loadAnalytics() {
      vm.loading = true;
      analyticsService.getSpendingAnalytics(vm.selectedMonth).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    }
    vm.onMonthChange = function() {
      loadAnalytics();
    };
    vm.filterByCategory = function(category) {
      vm.selectedCategory = category;
      analyticsService.getCategoryTransactions(category, vm.selectedMonth).then(function(transactions) {
        vm.categoryTransactions = transactions;
      }).catch(function(error) {
        vm.error = 'Failed to load category transactions.';
      });
    };
    initMonths();
    loadAnalytics();
  }]);
})();