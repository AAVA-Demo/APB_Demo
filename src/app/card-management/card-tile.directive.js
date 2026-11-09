(function() {
  'use strict';
  angular.module('app.cardManagement').directive('cardTile', cardTile);
  function cardTile() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&'
      },
      template: '<div class="card-tile" ng-click="selectCard()">' +
                '  <div class="card-holder">{{card.cardHolderName}}</div>' +
                '  <div class="card-number">{{card.cardNumber}}</div>' +
                '  <div class="card-expiry">Expires: {{card.expiryDate}}</div>' +
                '  <div class="card-expiry">{{card.cardType}}</div>' +
                '</div>',
      link: function(scope) {
        scope.selectCard = function() {
          scope.onSelect();
        };
      }
    };
  }
})();