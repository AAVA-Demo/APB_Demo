(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['TransactionService', 'AnalyticsEngine', '$scope', function(TransactionService, AnalyticsEngine, $scope) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.analyticsSummary = null;
      vm.selectedCardId = 'all';
      vm.selectedPeriod = 'current';
      vm.cards = [];
      
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        var startDate = vm.getStartDate();
        var endDate = new Date();
        TransactionService.getTransactions(vm.selectedCardId, startDate, endDate)
          .then(function(transactions) {
            vm.analyticsSummary = AnalyticsEngine.categorizeAndAggregate(transactions);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
          });
      };
      
      vm.getStartDate = function() {
        var date = new Date();
        if (vm.selectedPeriod === 'current') {
          date.setDate(1);
        } else if (vm.selectedPeriod === 'last3months') {
          date.setMonth(date.getMonth() - 3);
        } else if (vm.selectedPeriod === 'last6months') {
          date.setMonth(date.getMonth() - 6);
        } else if (vm.selectedPeriod === 'last12months') {
          date.setMonth(date.getMonth() - 12);
        }
        return date;
      };
      
      vm.onFilterChange = function() {
        vm.loadAnalytics();
      };
      
      TransactionService.getCards()
        .then(function(cards) {
          vm.cards = cards;
        });
      
      vm.loadAnalytics();
    }]);
})();