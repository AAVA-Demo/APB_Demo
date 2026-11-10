(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('transactionList', ['TransactionService', '$timeout', function(TransactionService, $timeout) {
      return {
        restrict: 'E',
        scope: {
          transactions: '=',
          onLoadMore: '&'
        },
        template: '<div class="transaction-list"><div class="transaction-item" ng-repeat="txn in transactions"><div class="txn-date">{{txn.date | date:"MMM dd, yyyy"}}</div><div class="txn-merchant">{{txn.merchant}}</div><div class="txn-category"><span class="label label-info">{{txn.category}}</span></div><div class="txn-amount" ng-class="{"negative": txn.amount < 0}">${{txn.amount | number:2}}</div><div class="txn-card">{{txn.cardName}}</div><div class="txn-status"><span class="label" ng-class="{"label-success": txn.status === "completed", "label-warning": txn.status === "pending", "label-danger": txn.status === "failed"}">{{txn.status}}</span></div></div></div>',
        link: function(scope, element, attrs) {
          var scrollContainer = element[0];
          element.on('scroll', function() {
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 50) {
              scope.$apply(function() {
                scope.onLoadMore();
              });
            }
          });
          scope.$on('$destroy', function() {
            element.off('scroll');
          });
        }
      };
    }]);
  transactionList.$inject = ['TransactionService', '$timeout'];
})();