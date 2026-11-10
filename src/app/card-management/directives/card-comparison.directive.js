(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardComparison', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '='
        },
        template: '<div class="row"><div class="col-md-4" ng-repeat="card in cards"><div class="card-tile"><div class="card-name">{{ card.cardName }}</div><div class="card-metric"><strong>Credit Limit:</strong> {{ card.creditLimit | currency }}</div><div class="card-metric"><strong>Available:</strong> {{ card.availableCredit | currency }}</div><div class="card-metric"><strong>Outstanding:</strong> {{ card.outstandingAmount | currency }}</div></div></div></div>'
      };
    }]);
})();