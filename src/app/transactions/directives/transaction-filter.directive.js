(function() {
  'use strict';
  angular.module('transactionModule')
    .directive('transactionFilter', [transactionFilter]);

  function transactionFilter() {
    return {
      restrict: 'E',
      scope: {
        filterCriteria: '=',
        cards: '<',
        categories: '<',
        onApply: '&',
        onReset: '&'
      },
      templateUrl: 'src/app/transactions/views/transaction-filter.html'
    };
  }
})();