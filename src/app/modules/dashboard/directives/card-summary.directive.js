(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('cardSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-summary">' +
                  '<h4>{{card.cardName}}</h4>' +
                  '<p><strong>Card Number:</strong> **** **** **** {{card.cardNumber.slice(-4)}}</p>' +
                  '<p><strong>Type:</strong> {{card.cardType}}</p>' +
                  '<p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p>' +
                  '<p><strong>Available Credit:</strong> ${{card.availableCredit | number:2}}</p>' +
                  '<p><strong>Outstanding:</strong> ${{card.outstandingAmount | number:2}}</p>' +
                  '<p><strong>Monthly Spend:</strong> ${{card.monthlySpend | number:2}}</p>' +
                  '<p><strong>Due Date:</strong> {{card.dueDate | date:"MMM dd, yyyy"}}</p>' +
                  '<span class="label" ng-class="{\"label-success\": card.status === \"Active\", \"label-danger\": card.status !== \"Active\"}">{{card.status}}</span>' +
                  '</div>'
      };
    }]);
})();