(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onClick: '&'
        },
        template: '<div class="card-tile" ng-click="onClick({card: card})"><div class="card-name">{{ card.cardName }}</div><div class="card-metric"><strong>Credit Limit:</strong> {{ card.creditLimit | currency }}</div><div class="card-metric"><strong>Available:</strong> {{ card.availableCredit | currency }}</div><div class="card-metric"><strong>Outstanding:</strong> {{ card.outstandingAmount | currency }}</div></div>'
      };
    }]);
})();