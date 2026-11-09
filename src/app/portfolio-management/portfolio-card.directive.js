(function() {
  'use strict';
  angular.module('portfolioManagementModule')
    .directive('portfolioCard', function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-tile" ng-click="onSelect()"><div class="card-type">{{card.cardType}}</div><div class="card-number">**** **** **** {{card.cardNumber.slice(-4)}}</div><div><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</div><div><strong>Available:</strong> {{card.availableCredit | currency}}</div><div><strong>Utilization:</strong> {{card.utilizationPercentage}}%</div><div class="utilization-bar"><div class="utilization-fill" ng-style="{width: card.utilizationPercentage + \'%\'}"></div></div></div>'
      };
    });
})();