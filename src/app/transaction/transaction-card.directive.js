(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionCard', transactionCard);
  function transactionCard() {
    return {
      restrict: 'E',
      scope: {
        transaction: '=',
        onSelect: '&'
      },
      template: '<div class="transaction-item" ng-click="onSelect({transactionId: transaction.transactionId})"><div class="row"><div class="col-sm-3"><strong>{{transaction.merchant}}</strong></div><div class="col-sm-2">{{transaction.date | date:"dd MMM yyyy"}}</div><div class="col-sm-2">₹{{transaction.amount | number:0}}</div><div class="col-sm-2">{{transaction.category}}</div><div class="col-sm-2"><span class="label" ng-class="{\"label-success\": transaction.status === \"posted\", \"label-warning\": transaction.status === \"pending\"}">{{transaction.status}}</span></div><div class="col-sm-1"><i class="fa fa-chevron-right"></i></div></div></div>'
    };
  }
})();