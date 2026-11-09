(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardList', [function() {
      return {
        restrict: 'A',
        scope: {
          cards: '=',
          onSelect: '='
        },
        template: '<div class="row">' +
          '<div class="col-xs-12 col-sm-6 col-md-4" ng-repeat="card in cards">' +
          '<div class="panel panel-default" style="cursor: pointer;" ng-click="onSelect(card.cardId)">' +
          '<div class="panel-heading"><strong>{{card.cardType}} - {{card.cardNumber}}</strong></div>' +
          '<div class="panel-body">' +
          '<p><strong>Cardholder:</strong> {{card.cardHolderName}}</p>' +
          '<p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p>' +
          '<p><strong>Available Credit:</strong> {{card.availableCredit | currency}}</p>' +
          '<p><strong>Current Balance:</strong> {{card.currentBalance | currency}}</p>' +
          '<p><strong>Expires:</strong> {{card.expiryDate}}</p>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>'
      };
    }]);
})();