(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardAnalyticsController', ['TransactionService', 'AnalyticsEngine', '$scope', function(TransactionService, AnalyticsEngine, $scope) {
    const vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.init = function() {
      TransactionService.getTransactions().then(function(transactions) {
        vm.analytics = AnalyticsEngine.analyze(transactions);
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();