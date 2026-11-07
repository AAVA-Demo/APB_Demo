(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .directive('transactionRow', [function() {
      return {
        restrict: 'A',
        scope: {
          transaction: '=',
          onClick: '&'
        },
        template: '<tr class="transaction-row" ng-click="onClick({txn: transaction})">' +
                  '  <td>{{transaction.date | date:"MM/dd/yyyy"}}</td>' +
                  '  <td>{{transaction.merchantName}}</td>' +
                  '  <td>{{transaction.merchantCategory}}</td>' +
                  '  <td>${{transaction.amount | number:2}}</td>' +
                  '  <td>{{transaction.cardName}} {{transaction.cardLastFour}}</td>' +
                  '  <td><span class="label label-success">{{transaction.status}}</span></td>' +
                  '</tr>'
      };
    }]);
})();