(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardDetail', [cardDetail]);
  function cardDetail() {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      template: '<div class="card-detail-view" ng-if="card">' +
                '  <div class="detail-header">' +
                '    <h3>{{card.cardLabel || card.cardType}}</h3>' +
                '    <p class="card-number">{{card.cardNumber}}</p>' +
                '  </div>' +
                '  <div class="detail-section">' +
                '    <h4>Account Summary</h4>' +
                '    <div class="detail-row">' +
                '      <span class="label">Credit Limit:</span>' +
                '      <span class="value">{{card.creditLimit | currency}}</span>' +
                '    </div>' +
                '    <div class="detail-row">' +
                '      <span class="label">Available Credit:</span>' +
                '      <span class="value">{{card.availableCredit | currency}}</span>' +
                '    </div>' +
                '    <div class="detail-row">' +
                '      <span class="label">Outstanding Balance:</span>' +
                '      <span class="value">{{card.outstandingBalance | currency}}</span>' +
                '    </div>' +
                '    <div class="detail-row">' +
                '      <span class="label">Statement Balance:</span>' +
                '      <span class="value">{{card.statementBalance | currency}}</span>' +
                '    </div>' +
                '    <div class="detail-row">' +
                '      <span class="label">Minimum Payment:</span>' +
                '      <span class="value">{{card.minimumPayment | currency}}</span>' +
                '    </div>' +
                '    <div class="detail-row">' +
                '      <span class="label">Due Date:</span>' +
                '      <span class="value">{{card.dueDate | date:"MMM dd, yyyy"}}</span>' +
                '    </div>' +
                '  </div>' +
                '  <div class="detail-section" ng-if="card.recentTransactions && card.recentTransactions.length">' +
                '    <h4>Recent Transactions</h4>' +
                '    <table class="table table-striped">' +
                '      <thead>' +
                '        <tr>' +
                '          <th>Date</th>' +
                '          <th>Merchant</th>' +
                '          <th>Category</th>' +
                '          <th>Amount</th>' +
                '        </tr>' +
                '      </thead>' +
                '      <tbody>' +
                '        <tr ng-repeat="txn in card.recentTransactions">' +
                '          <td>{{txn.date | date:"MMM dd"}}</td>' +
                '          <td>{{txn.merchant}}</td>' +
                '          <td>{{txn.category}}</td>' +
                '          <td>{{txn.amount | currency}}</td>' +
                '        </tr>' +
                '      </tbody>' +
                '    </table>' +
                '  </div>' +
                '  <div class="detail-section" ng-if="card.monthlySpendByCategory">' +
                '    <h4>Monthly Spend by Category</h4>' +
                '    <div class="category-spend" ng-repeat="(category, amount) in card.monthlySpendByCategory">' +
                '      <span class="label">{{category}}:</span>' +
                '      <span class="value">{{amount | currency}}</span>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();