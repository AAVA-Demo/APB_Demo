(function() {
  'use strict';
  angular.module('portfolioModule')
    .directive('cardDetail', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-detail" ng-click="selectCard()"><div class="card-header"><h4>{{card.cardType}} {{card.cardNumber}}</h4></div><div class="card-body"><div class="card-info"><span class="label">Credit Limit:</span><span class="value">{{card.creditLimit | currency}}</span></div><div class="card-info"><span class="label">Current Balance:</span><span class="value">{{card.currentBalance | currency}}</span></div><div class="card-info"><span class="label">Monthly Spend:</span><span class="value">{{card.monthlySpend | currency}}</span></div></div></div>',
        link: function(scope) {
          scope.selectCard = function() {
            if (scope.onSelect) {
              scope.onSelect({card: scope.card});
            }
          };
        }
      };
    }]);
})();