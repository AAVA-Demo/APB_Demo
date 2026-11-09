(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('cardSummary', function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-summary panel panel-info">' +
                  '  <div class="panel-heading">' +
                  '    <h4>{{card.cardType}} - {{card.cardNumber}}</h4>' +
                  '  </div>' +
                  '  <div class="panel-body">' +
                  '    <div class="row">' +
                  '      <div class="col-xs-6"><strong>Credit Limit:</strong></div>' +
                  '      <div class="col-xs-6 text-right">{{card.creditLimit | currency}}</div>' +
                  '    </div>' +
                  '    <div class="row">' +
                  '      <div class="col-xs-6"><strong>Current Balance:</strong></div>' +
                  '      <div class="col-xs-6 text-right">{{card.currentBalance | currency}}</div>' +
                  '    </div>' +
                  '    <div class="row">' +
                  '      <div class="col-xs-6"><strong>Available Credit:</strong></div>' +
                  '      <div class="col-xs-6 text-right">{{card.availableCredit | currency}}</div>' +
                  '    </div>' +
                  '    <div class="row">' +
                  '      <div class="col-xs-6"><strong>Outstanding:</strong></div>' +
                  '      <div class="col-xs-6 text-right">{{card.outstandingAmount | currency}}</div>' +
                  '    </div>' +
                  '    <div class="row" ng-if="card.dueDate">' +
                  '      <div class="col-xs-6"><strong>Due Date:</strong></div>' +
                  '      <div class="col-xs-6 text-right">{{card.dueDate | date:"MMM dd, yyyy"}}</div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();