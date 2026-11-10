(function() {
  'use strict';
  angular.module('cardManagement')
    .directive('cardDetail', [function() {
      return {
        restrict: 'A',
        scope: {
          card: '='
        },
        template: '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">{{card.issuer}} {{card.cardType}}</h3></div><div class="panel-body"><p><strong>Card Number:</strong> {{card.cardNumber}}</p><p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p><p><strong>Current Balance:</strong> ${{card.currentBalance | number:2}}</p><p><strong>Available Credit:</strong> ${{card.availableCredit | number:2}}</p><p><strong>Outstanding Amount:</strong> ${{card.outstandingAmount | number:2}}</p><p><strong>Monthly Spend:</strong> ${{card.monthlySpend | number:2}}</p><p><strong>Status:</strong> <span class="label label-success">{{card.status}}</span></p><p><strong>Expiry Date:</strong> {{card.expiryDate}}</p></div><div class="panel-footer"><h4>Spending Analysis</h4><p>Total Spend: ${{card.monthlySpend | number:2}}</p><p>Transaction Count: {{card.transactionCount || 0}}</p><p ng-if="card.categoryBreakdown">Category breakdown and recent transactions would be displayed here.</p></div></div>'
      };
    }]);
})();