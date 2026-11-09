(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['analyticsService', '$scope', 'authFactory'];
  function AnalyticsController(analyticsService, $scope, authFactory) {
    var vm = this;
    vm.categoryBreakdown = [];
    vm.totalSpend = 0;
    vm.loading = true;
    vm.selectedCategory = null;
    vm.filteredTransactions = [];
    vm.init = function() {
      var userId = authFactory.getUserId();
      analyticsService.loadCategoryAnalytics(userId).then(function(data) {
        vm.categoryBreakdown = data.categoryBreakdown;
        vm.totalSpend = data.totalSpend;
        vm.loading = false;
      }).catch(function() {
        vm.loading = false;
      });
    };
    vm.filterByCategory = function(category) {
      vm.selectedCategory = category;
      analyticsService.getTransactionsByCategory(category).then(function(transactions) {
        vm.filteredTransactions = transactions;
      });
    };
    vm.init();
  }
})();