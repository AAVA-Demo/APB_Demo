(function() {
  'use strict';
  angular.module('transactionModule')
    .directive('transactionCard', function() {
      return {
        restrict: 'E',
        scope: {
          transaction: '='
        },
        template: '<div class="transaction-card panel panel-default">' +
                  '  <div class="panel-body">' +
                  '    <div class="row">' +
                  '      <div class="col-xs-8">' +
                  '        <h4>{{transaction.merchantName}}</h4>' +
                  '        <p class="text-muted">{{transaction.category}}</p>' +
                  '        <p><small>{{transaction.timestamp | date:"MMM dd, yyyy HH:mm"}}</small></p>' +
                  '      </div>' +
                  '      <div class="col-xs-4 text-right">' +
                  '        <h3 class="transaction-amount" ng-class="{"text-danger": transaction.amount > 0}">{{transaction.currency}} {{transaction.amount | number:2}}</h3>' +
                  '        <span class="label" ng-class="{"label-success": transaction.status === "posted", "label-warning": transaction.status === "pending"}">{{transaction.status}}</span>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="row" ng-if="transaction.description">' +
                  '      <div class="col-xs-12">' +
                  '        <p><small>{{transaction.description}}</small></p>' +
                  '      </div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();