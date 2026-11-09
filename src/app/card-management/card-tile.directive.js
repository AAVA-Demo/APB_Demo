(function() {
  'use strict';
  angular.module('cardManagementModule')
    .directive('cardTile', function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onClick: '&'
        },
        template: '<div class="card-tile" ng-click="onClick()"><div class="card-type">{{card.cardType}} - {{card.issuer}}</div><div class="card-number">{{card.cardNumber}}</div><div style="margin-top:10px;"><strong>Limit:</strong> {{card.creditLimit | currency}}</div><div><strong>Balance:</strong> {{card.currentBalance | currency}}</div><div><strong>Utilization:</strong> {{card.utilizationPercentage}}%</div><div class="utilization-bar"><div class="utilization-fill" ng-style="{width: card.utilizationPercentage + \'%\'}"></div></div></div>'
      };
    });
})();