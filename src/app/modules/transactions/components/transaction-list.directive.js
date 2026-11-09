(function() {
  'use strict';
  angular.module('creditCard.transactions').directive('ccTransactionList', [function() {
    return {
      restrict: 'E',
      scope: {
        transactions: '=',
        onSelect: '&'
      },
      template: '<div class="transaction-list"><div class="table-responsive"><table class="table table-striped table-hover"><thead><tr><th>Date</th><th>Merchant</th><th>Amount</th><th>Category</th><th>Status</th></tr></thead><tbody><tr ng-repeat="txn in transactions track by txn.id" ng-click="selectTransaction(txn)" style="cursor:pointer;"><td>{{txn.date | date:"MM/dd/yyyy"}}</td><td>{{txn.merchant}}</td><td>${{txn.amount | number:2}}</td><td>{{txn.category}}</td><td><span class="label label-success" ng-if="txn.status === \'Posted\'">{{txn.status}}</span><span class="label label-warning" ng-if="txn.status !== \'Posted\'">{{txn.status}}</span></td></tr></tbody></table></div></div>',
      link: function(scope) {
        scope.selectTransaction = function(txn) {
          scope.onSelect({transaction: txn});
        };
      }
    };
  }]);
})();