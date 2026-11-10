(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionCard', transactionCard);
  function transactionCard() {
    return {
      restrict: 'E',
      scope: {
        transaction: '='
      },
      template: '<div class="transaction-item"><div class="row"><div class="col-sm-6"><strong>{{transaction.merchantName}}</strong><br><small>{{transaction.category}}</small></div><div class="col-sm-3"><span class="label" ng-class="{\"label-success\": transaction.status === \"posted\", \"label-warning\": transaction.status === \"pending\"}">{{transaction.status}}</span></div><div class="col-sm-3 text-right"><strong>{{transaction.currency}} {{transaction.amount | number:2}}</strong><br><small>{{transaction.transactionDate | date:"MMM dd, yyyy"}}</small></div></div><div ng-if="transaction.description" class="" style="margin-top: 8px;"><small class="text-muted">{{transaction.description}}</small></div></div>'
    };
  }
})();