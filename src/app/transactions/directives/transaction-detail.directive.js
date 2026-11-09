(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionDetail', function() {
    return {
      restrict: 'E',
      scope: {
        transaction: '=',
        onClose: '&'
      },
      templateUrl: 'src/app/transactions/directives/transaction-detail.template.html'
    };
  });
})();