(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('transactionList', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          transactions: '=',
          onSelect: '&'
        },
        template: '<div class="table-responsive"><table class="table table-striped table-hover"><thead><tr><th ng-click="sortBy(\'date\')">Date</th><th ng-click="sortBy(\'merchant\')">Merchant</th><th ng-click="sortBy(\'category\')">Category</th><th ng-click="sortBy(\'amount\')">Amount</th><th>Status</th><th>Action</th></tr></thead><tbody><tr ng-repeat="txn in sortedTransactions track by txn.transactionId" ng-click="selectTransaction(txn.transactionId)" style="cursor:pointer;"><td>{{txn.date | date:\'short\'}}</td><td>{{txn.merchant}}</td><td>{{txn.category}}</td><td>{{txn.amount | currency}}</td><td><span class="label" ng-class="{\'label-success\': txn.status === \'posted\', \'label-warning\': txn.status === \'pending\'}">{{txn.status}}</span></td><td><button class="btn btn-sm btn-primary" ng-click="selectTransaction(txn.transactionId); $event.stopPropagation();">View</button></td></tr></tbody></table></div>',
        link: function(scope) {
          scope.sortField = 'date';
          scope.sortReverse = true;
          scope.sortBy = function(field) {
            if (scope.sortField === field) {
              scope.sortReverse = !scope.sortReverse;
            } else {
              scope.sortField = field;
              scope.sortReverse = false;
            }
            updateSort();
          };
          scope.selectTransaction = function(transactionId) {
            scope.onSelect({transactionId: transactionId});
          };
          scope.$watch('transactions', function() {
            updateSort();
          });
          function updateSort() {
            scope.sortedTransactions = $filter('orderBy')(scope.transactions, scope.sortField, scope.sortReverse);
          }
        }
      };
    }]);
})();