(function() {
  'use strict';
  angular.module('creditCard.transactions').component('ccTransactionDetail', {
    bindings: {
      transaction: '<',
      onClose: '&'
    },
    template: '<div class="transaction-detail" ng-if="$ctrl.transaction"><div class="panel panel-default"><div class="panel-heading"><h4>Transaction Details<button type="button" class="close" ng-click="$ctrl.onClose()">&times;</button></h4></div><div class="panel-body"><dl class="dl-horizontal"><dt>Transaction ID:</dt><dd>{{$ctrl.transaction.id}}</dd><dt>Date:</dt><dd>{{$ctrl.transaction.date | date:"MM/dd/yyyy HH:mm"}}</dd><dt>Merchant:</dt><dd>{{$ctrl.transaction.merchant}}</dd><dt>Amount:</dt><dd>${{$ctrl.transaction.amount | number:2}}</dd><dt>Category:</dt><dd>{{$ctrl.transaction.category}}</dd><dt>Status:</dt><dd><span class="label label-success" ng-if="$ctrl.transaction.status === \'Posted\'">{{$ctrl.transaction.status}}</span><span class="label label-warning" ng-if="$ctrl.transaction.status !== \'Posted\'">{{$ctrl.transaction.status}}</span></dd><dt>Description:</dt><dd>{{$ctrl.transaction.description}}</dd><dt>Card ID:</dt><dd>{{$ctrl.transaction.cardId}}</dd></dl></div></div></div><div class="transaction-detail" ng-if="!$ctrl.transaction"><div class="panel panel-default"><div class="panel-body text-center"><p>Select a transaction to view details</p></div></div></div>'
  });
})();