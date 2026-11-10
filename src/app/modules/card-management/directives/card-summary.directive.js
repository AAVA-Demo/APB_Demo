(function() {
  'use strict';
  angular.module('cardManagement')
    .directive('cardSummary', ['CardEncryptionService', function(CardEncryptionService) {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-summary">' +
                  '<h4>{{card.cardIssuer}} - {{card.cardType}}</h4>' +
                  '<p class="card-number">{{maskedCardNumber}}</p>' +
                  '<div class="row">' +
                  '<div class="col-xs-6"><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</div>' +
                  '<div class="col-xs-6"><strong>Available:</strong> {{card.availableCredit | currency}}</div>' +
                  '</div>' +
                  '<div class="row">' +
                  '<div class="col-xs-6"><strong>Outstanding:</strong> {{card.outstandingBalance | currency}}</div>' +
                  '<div class="col-xs-6"><strong>Status:</strong> <span ng-class="{"text-success": card.isActive, "text-danger": !card.isActive}">{{card.isActive ? "Active" : "Inactive"}}</span></div>' +
                  '</div>' +
                  '<a href="#/cards/{{card.cardId}}" class="btn btn-sm btn-primary" style="margin-top: 10px;">View Details</a>' +
                  '</div>',
        link: function(scope) {
          scope.maskedCardNumber = CardEncryptionService.maskCardNumber(scope.card.cardNumber);
        }
      };
    }]);
})();