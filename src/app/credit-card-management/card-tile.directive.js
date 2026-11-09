(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardTile', function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-tile" ng-click="onSelect({cardId: card.cardId})">' +
                  '<div class="card-number">{{card.cardNumber}}</div>' +
                  '<div class="card-type">{{card.cardType}} | Exp: {{card.expiryDate}}</div>' +
                  '<div style="margin-top:10px;">' +
                  '<strong>Credit Limit:</strong> ₹{{card.creditLimit | number:0}}<br>' +
                  '<strong>Available:</strong> ₹{{card.availableCredit | number:0}}<br>' +
                  '<strong>Outstanding:</strong> ₹{{card.outstandingAmount | number:0}}<br>' +
                  '<strong>Monthly Spend:</strong> ₹{{card.monthlySpend | number:0}}' +
                  '</div>' +
                  '</div>'
      };
    });
})();