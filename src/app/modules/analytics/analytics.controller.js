(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionDataService', 'CategoryService', 'AnalyticsEngine', 'DateTimeService', function($scope, TransactionDataService, CategoryService, AnalyticsEngine, DateTimeService) {
      var vm = this;
      vm.analyticsData = {};
      vm.categories = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCard = null;
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        var dateRange = DateTimeService.getLast12Months();
        var params = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };
        if (vm.selectedCard) {
          params.cardId = vm.selectedCard;
        }
        Promise.all([
          TransactionDataService.getTransactions(params),
          CategoryService.getCategories()
        ]).then(function(results) {
          var transactions = results[0].transactions || [];
          vm.categories = results[1];
          vm.analyticsData = AnalyticsEngine.aggregate(transactions, vm.categories);
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.updateFilter = function() {
        vm.loadAnalytics();
      };
      vm.loadAnalytics();
    }]);
})();