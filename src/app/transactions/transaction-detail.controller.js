(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', ['$uibModalInstance', 'transaction', function($uibModalInstance, transaction) {
    const vm = this;
    vm.transaction = transaction;
    vm.close = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
})();