(function() {
  'use strict';
  angular.module('ccTransactionModule').directive('transactionCard', [function() {
    return {
      restrict: 'E',
      scope: {
        transaction: '='
      },
      template: '<div class="transaction-card"><span class="merchant">{{transaction.merchant}}</span><span class="amount">${{transaction.amount | number:2}}</span><div class="date">{{transaction.date | date:"MMM dd, yyyy"}} | Card ending in {{transaction.cardLast4}}</div><span class="category">{{transaction.category}}</span><div ng-if="transaction.description" style="margin-top:5px; color:#777; font-size:12px;">{{transaction.description}}</div></div>'
    };
  }]);
})();