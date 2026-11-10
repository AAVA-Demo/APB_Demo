(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .directive('transactionCard', function() {
      return {
        restrict: 'E',
        scope: {
          transaction: '='
        },
        template: '<div class="transaction-item"><div><div class="merchant">{{transaction.merchantName}}</div><div class="date">{{transaction.transactionDate | date:\'MMM dd, yyyy\'}}</div><span class="category-badge">{{transaction.category}}</span></div><div><div class="amount">${{transaction.amount | number:2}}</div><div style="font-size:12px;color:#999;">{{transaction.cardName}}</div></div></div>'
      };
    });
})();