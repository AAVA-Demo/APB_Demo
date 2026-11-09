(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionList', [function() {
    return {
      restrict: 'E',
      scope: {
        transactions: '=',
        onSelect: '&'
      },
      template: '<div class="table-responsive">' +
                '  <table class="table table-striped table-hover">' +
                '    <thead>' +
                '      <tr>' +
                '        <th>Date</th>' +
                '        <th>Merchant</th>' +
                '        <th>Amount</th>' +
                '        <th>Card</th>' +
                '        <th>Category</th>' +
                '      </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '      <tr ng-repeat="txn in transactions" class="transaction-row" ng-click="selectTransaction(txn.transactionId)">' +
                '        <td>{{txn.transactionDate | date:"short"}}</td>' +
                '        <td>{{txn.merchantName}}</td>' +
                '        <td>${{txn.amount | number:2}}</td>' +
                '        <td>{{txn.cardName}}</td>' +
                '        <td>{{txn.category}}</td>' +
                '      </tr>' +
                '    </tbody>' +
                '  </table>' +
                '</div>',
      link: function(scope) {
        scope.selectTransaction = function(transactionId) {
          scope.onSelect({ transactionId: transactionId });
        };
      }
    };
  }]);
})();