(function() {
  'use strict';
  angular.module('creditCardPortfolioModule')
    .directive('portfolioCard', function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-tile" ng-click="onSelect({cardId: card.cardId})">' +
                  '<h4>{{card.cardType}} {{card.cardNumber}}</h4>' +
                  '<p><strong>Issuer:</strong> {{card.issuer}}</p>' +
                  '<p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p>' +
                  '<p><strong>Outstanding:</strong> {{card.outstandingBalance | currency}}</p>' +
                  '<p><strong>Available:</strong> {{card.availableCredit | currency}}</p>' +
                  '</div>'
      };
    });
})();