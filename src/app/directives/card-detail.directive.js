(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardDetail', [function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        metrics: '='
      },
      template: '<div class="panel panel-primary" style="margin-top: 20px;"><div class="panel-heading"><h3 class="panel-title">Card Details - {{card.cardType}} {{card.cardNumber}}</h3></div><div class="panel-body"><div class="row"><div class="col-xs-12 col-md-6"><p><strong>Card Holder:</strong> {{card.cardHolderName}}</p><p><strong>Card Type:</strong> {{card.cardType}}</p><p><strong>Issuer:</strong> {{card.issuer}}</p><p><strong>Expiry Date:</strong> {{card.expiryDate}}</p></div><div class="col-xs-12 col-md-6"><p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p><p><strong>Outstanding Balance:</strong> {{card.outstandingBalance | currency}}</p><p><strong>Available Credit:</strong> {{card.availableCredit | currency}}</p></div></div><hr><div ng-if="metrics"><h4>Card Metrics</h4><p><strong>Monthly Spend:</strong> {{metrics.monthlySpend | currency}}</p><p><strong>Utilization Rate:</strong> {{metrics.utilizationRate | number:1}}%</p><p><strong>Transaction Count:</strong> {{metrics.transactionCount}}</p><p><strong>Last Transaction:</strong> {{metrics.lastTransactionDate | date:"short"}}</p></div></div></div>'
    };
  }]);
})();