(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .directive('cardList', ['PortfolioService', function(PortfolioService) {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&',
          selectedCardId: '='
        },
        template: '<div class="row">' +
                  '<div class="col-md-4 col-sm-6" ng-repeat="card in cards track by card.cardId">' +
                  '<div class="card-tile" ng-class="{selected: card.cardId === selectedCardId}" ng-click="selectCard(card.cardId)">' +
                  '<h4>{{ card.cardType }} {{ card.cardNumber }}</h4>' +
                  '<p><strong>Holder:</strong> {{ card.cardHolderName }}</p>' +
                  '<p><strong>Limit:</strong> ₹{{ card.creditLimit | number }}</p>' +
                  '<p><strong>Available:</strong> ₹{{ card.availableCredit | number }}</p>' +
                  '<p><strong>Outstanding:</strong> ₹{{ card.outstandingAmount | number }}</p>' +
                  '<p><strong>Expiry:</strong> {{ card.expiryDate }}</p>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
        link: function(scope) {
          scope.selectCard = function(cardId) {
            scope.onSelect({ cardId: cardId });
          };
        }
      };
    }]);
})();