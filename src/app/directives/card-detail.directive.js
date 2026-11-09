(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardDetail', [function() {
      return {
        restrict: 'A',
        scope: {
          card: '=',
          transactions: '=',
          filters: '=',
          onFilter: '=',
          onSort: '=',
          sortField: '=',
          sortReverse: '='
        },
        template: '<div>' +
          '<div class="panel panel-primary">' +
          '<div class="panel-heading"><h3>{{card.cardType}} - {{card.cardNumber}}</h3></div>' +
          '<div class="panel-body">' +
          '<div class="row">' +
          '<div class="col-md-6"><p><strong>Cardholder:</strong> {{card.cardHolderName}}</p></div>' +
          '<div class="col-md-6"><p><strong>Expires:</strong> {{card.expiryDate}}</p></div>' +
          '</div>' +
          '<div class="row">' +
          '<div class="col-md-4"><p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p></div>' +
          '<div class="col-md-4"><p><strong>Available Credit:</strong> {{card.availableCredit | currency}}</p></div>' +
          '<div class="col-md-4"><p><strong>Current Balance:</strong> {{card.currentBalance | currency}}</p></div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<h3>Transactions</h3>' +
          '<div class="panel panel-default">' +
          '<div class="panel-body">' +
          '<div class="row">' +
          '<div class="col-md-4">' +
          '<label>Category:</label>' +
          '<select class="form-control" ng-model="filters.category" ng-change="onFilter()">' +
          '<option value="">All</option>' +
          '<option value="Food & Dining">Food & Dining</option>' +
          '<option value="Fuel">Fuel</option>' +
          '<option value="Shopping">Shopping</option>' +
          '<option value="Travel">Travel</option>' +
          '<option value="Entertainment">Entertainment</option>' +
          '<option value="Utilities">Utilities</option>' +
          '<option value="Healthcare">Healthcare</option>' +
          '<option value="Education">Education</option>' +
          '<option value="Miscellaneous">Miscellaneous</option>' +
          '</select>' +
          '</div>' +
          '<div class="col-md-4">' +
          '<label>Date From:</label>' +
          '<input type="date" class="form-control" ng-model="filters.dateFrom" ng-change="onFilter()">' +
          '</div>' +
          '<div class="col-md-4">' +
          '<label>Date To:</label>' +
          '<input type="date" class="form-control" ng-model="filters.dateTo" ng-change="onFilter()">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<table class="table table-striped table-hover">' +
          '<thead>' +
          '<tr>' +
          '<th ng-click="onSort(\'transactionDate\')">Date <span ng-if="sortField===\'transactionDate\'">{{sortReverse ? "▼" : "▲"}}</span></th>' +
          '<th ng-click="onSort(\'merchant\')">Merchant <span ng-if="sortField===\'merchant\'">{{sortReverse ? "▼" : "▲"}}</span></th>' +
          '<th ng-click="onSort(\'category\')">Category <span ng-if="sortField===\'category\'">{{sortReverse ? "▼" : "▲"}}</span></th>' +
          '<th ng-click="onSort(\'amount\')">Amount <span ng-if="sortField===\'amount\'">{{sortReverse ? "▼" : "▲"}}</span></th>' +
          '<th>Description</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr ng-repeat="txn in transactions | orderBy:sortField:sortReverse">' +
          '<td>{{txn.transactionDate | date:"short"}}</td>' +
          '<td>{{txn.merchant}}</td>' +
          '<td>{{txn.category}}</td>' +
          '<td>{{txn.amount | currency}}</td>' +
          '<td>{{txn.description}}</td>' +
          '</tr>' +
          '</tbody>' +
          '</table>' +
          '</div>'
      };
    }]);
})();