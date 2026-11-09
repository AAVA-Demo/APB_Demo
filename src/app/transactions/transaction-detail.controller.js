(function() {
  'use strict';
  angular.module('app.transactions').controller('TransactionDetailController', ['TransactionService', '$routeParams', '$scope', function(TransactionService, $routeParams, $scope) {
    var vm = this;
    vm.transaction = null;
    vm.loading = true;
    function init() {
      var transactionId = $routeParams.transactionId;
      TransactionService.getTransactionById(transactionId).then(function(data) {
        vm.transaction = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transaction details.';
        vm.loading = false;
      });
    }
    init();
  }]);
})();