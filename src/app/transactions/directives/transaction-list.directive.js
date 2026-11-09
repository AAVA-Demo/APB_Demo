(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionList', function() {
    return {
      restrict: 'E',
      scope: {
        transactions: '=',
        onSelect: '&'
      },
      templateUrl: 'src/app/transactions/directives/transaction-list.template.html'
    };
  });
})();