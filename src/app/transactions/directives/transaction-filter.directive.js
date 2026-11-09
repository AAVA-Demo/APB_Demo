(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionFilter', function() {
    return {
      restrict: 'E',
      scope: {
        filter: '=',
        onApply: '&'
      },
      templateUrl: 'src/app/transactions/directives/transaction-filter.template.html'
    };
  });
})();