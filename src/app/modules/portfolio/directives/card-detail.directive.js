(function() {
  'use strict';
  angular.module('app.portfolio')
    .directive('cardDetail', function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          detail: '='
        },
        template: '<div class="card" ng-if="card">' +
                  '  <div class="card-header">' +
                  '    <h4>{{card.cardName}}</h4>' +
                  '    <small>{{card.cardNumber}}</small>' +
                  '  </div>' +
                  '  <div class="card-body">' +
                  '    <div class="row mb-3">' +
                  '      <div class="col-md-3">' +
                  '        <strong>Credit Limit</strong><br>{{card.creditLimit | currency}}' +
                  '      </div>' +
                  '      <div class="col-md-3">' +
                  '        <strong>Current Balance</strong><br>{{card.currentBalance | currency}}' +
                  '      </div>' +
                  '      <div class="col-md-3">' +
                  '        <strong>Available Credit</strong><br>{{card.availableCredit | currency}}' +
                  '      </div>' +
                  '      <div class="col-md-3">' +
                  '        <strong>Utilization</strong><br>{{card.utilizationPercentage}}%' +
                  '      </div>' +
                  '    </div>' +
                  '    <div ng-if="detail">' +
                  '      <h5>Spending Breakdown</h5>' +
                  '      <table class="table table-sm">' +
                  '        <thead><tr><th>Category</th><th>Amount</th></tr></thead>' +
                  '        <tbody>' +
                  '          <tr ng-repeat="cat in detail.categoryBreakdown">' +
                  '            <td>{{cat.category}}</td><td>{{cat.amount | currency}}</td>' +
                  '          </tr>' +
                  '        </tbody>' +
                  '      </table>' +
                  '      <h5 class="mt-3">Recent Transactions</h5>' +
                  '      <table class="table table-sm">' +
                  '        <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th></tr></thead>' +
                  '        <tbody>' +
                  '          <tr ng-repeat="txn in detail.recentTransactions">' +
                  '            <td>{{txn.date | date:\'short\'}}</td>' +
                  '            <td>{{txn.merchant}}</td>' +
                  '            <td>{{txn.category}}</td>' +
                  '            <td>{{txn.amount | currency}}</td>' +
                  '          </tr>' +
                  '        </tbody>' +
                  '      </table>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();