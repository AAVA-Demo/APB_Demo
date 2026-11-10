(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionList', [function() {
    return {
      restrict: 'E',
      scope: { transactions: '=' },
      template: '<div class="transaction-table"><table class="table table-striped"><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Card</th><th>Action</th></tr></thead><tbody><tr ng-repeat="txn in transactions"><td>{{txn.transactionDate | date:"short"}}</td><td>{{txn.merchantName}}</td><td>{{txn.category}}</td><td>{{txn.amount | currency}}</td><td>{{txn.cardDetails.cardNumber}}</td><td><a href="#!/transactions/{{txn.transactionId}}" class="btn btn-sm btn-info">View</a></td></tr></tbody></table></div>'
    };
  }]);
})();