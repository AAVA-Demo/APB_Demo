(function() {
  'use strict';
  angular.module('creditCardApp.transaction')
    .directive('transactionList', [transactionList]);

  function transactionList() {
    return {
      restrict: 'E',
      scope: {
        transactions: '=',
        onSelect: '&'
      },
      templateUrl: 'src/app/transaction/views/transaction-list.template.html'
    };
  }
})();