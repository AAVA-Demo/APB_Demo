(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardTile', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onClick: '&'
        },
        template: '<div class="card-tile" ng-class="{inactive: card.status !== \'active\'}" ng-click="onClick({cardId: card.cardId})">' +
                  '<div class="card-number">{{card.cardNumber}}</div>' +
                  '<div class="card-issuer">{{card.issuer}}</div>' +
                  '<div class="card-holder">{{card.cardHolderName}}</div>' +
                  '<div class="card-expiry">Expires: {{card.expiryDate}}</div>' +
                  '<div class="card-balance">Available: {{card.availableCredit | currency}}</div>' +
                  '<div class="card-status"><span class="label" ng-class="{\'label-success\': card.status === \'active\', \'label-default\': card.status === \'inactive\', \'label-danger\': card.status === \'blocked\'}">{{card.status | uppercase}}</span></div>' +
                  '</div>'
      };
    }]);
})();