(function() {
  'use strict';
  angular.module('dashboardModule').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div class="row">' +
        '<div class="col-md-4 col-sm-6 col-xs-12" ng-repeat="card in cards track by card.cardId">' +
        '<div class="card-tile">' +
        '<h4>{{card.cardName}}</h4>' +
        '<div class="card-info">' +
        '<span><strong>Card Number:</strong> {{card.cardNumber}}</span>' +
        '<span><strong>Credit Limit:</strong> ₹{{card.creditLimit | number:0}}</span>' +
        '<span><strong>Available Credit:</strong> ₹{{card.availableCredit | number:0}}</span>' +
        '<span><strong>Outstanding:</strong> ₹{{card.outstandingAmount | number:0}}</span>' +
        '<span class="text-muted"><small>Last Updated: {{card.lastUpdated | date:"short"}}</small></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    };
  }]);
})();