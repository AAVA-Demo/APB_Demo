(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('creditCardSummary', function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="credit-card-tile"><div class="card-name">{{card.cardName}}</div><div class="card-limit">Credit Limit: ${{card.creditLimit | number:2}}</div><div class="card-limit">Available: ${{card.availableCredit | number:2}}</div><div class="utilization-bar"><div class="utilization-fill" ng-style="{width: utilizationPercent + \'%\'}"></div></div><div class="card-limit" style="margin-top:5px;">Utilization: {{utilizationPercent}}%</div></div>',
        link: function(scope) {
          scope.$watch('card', function(card) {
            if (card && card.creditLimit > 0) {
              var outstanding = card.outstandingAmount || 0;
              scope.utilizationPercent = ((outstanding / card.creditLimit) * 100).toFixed(1);
            } else {
              scope.utilizationPercent = 0;
            }
          });
        }
      };
    });
})();