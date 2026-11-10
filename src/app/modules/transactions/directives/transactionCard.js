(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionCard', [function() {
    return {
      restrict: 'E',
      scope: {
        transaction: '=',
        onClick: '&'
      },
      template: '<div class="transaction-card" ng-click="onClick({id: transaction.transactionId})"><div class="row"><div class="col-xs-8"><h5><strong>{{transaction.merchantName}}</strong></h5><p><small>{{transaction.category}} | {{transaction.cardName}}</small></p><p><small>{{transaction.transactionDate | date:"MMM dd, yyyy"}}</small></p></div><div class="col-xs-4 text-right"><h4><strong>{{transaction.currency}} {{transaction.amount | number:2}}</strong></h4><span class="label" ng-class="{\"label-success\": transaction.status === \"posted\", \"label-warning\": transaction.status === \"pending\", \"label-danger\": transaction.status === \"declined\"}">{{transaction.status}}</span></div></div></div>'
    };
  }]);
})();