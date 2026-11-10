(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('cardSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '='
        },
        template: '<div class="card-summary"><div class="card-item" ng-repeat="card in cards"><h5>{{card.cardName}}</h5><p>Credit Limit: {{card.creditLimit | currency}}</p><p>Available: {{card.availableCredit | currency}}</p><p>Outstanding: {{card.currentBalance | currency}}</p></div></div>'
      };
    }]);
})();