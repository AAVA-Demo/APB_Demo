(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('transactionDetail', [function() {
      return {
        restrict: 'E',
        scope: {
          transaction: '='
        },
        template: '<div class="panel panel-default" ng-if="transaction"><div class="panel-heading"><h4>Transaction Details</h4></div><div class="panel-body"><div class="row"><div class="col-sm-6"><p><strong>Transaction ID:</strong> {{transaction.transactionId}}</p><p><strong>Card:</strong> {{transaction.cardName}}</p><p><strong>Amount:</strong> {{transaction.currency}} {{transaction.amount | number:2}}</p></div><div class="col-sm-6"><p><strong>Date:</strong> {{transaction.transactionDate | date:"medium"}}</p><p><strong>Merchant:</strong> {{transaction.merchantName}}</p><p><strong>Category:</strong> {{transaction.category}}</p></div></div><p><strong>Description:</strong> {{transaction.description}}</p><p><strong>Status:</strong> <span class="label" ng-class="{\"label-success\": transaction.status === \"posted\", \"label-warning\": transaction.status === \"pending\"}">{{transaction.status | uppercase}}</span></p></div></div>'
      };
    }]);
})();