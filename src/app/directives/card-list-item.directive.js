(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardListItem', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="panel panel-default card-item" ng-click="onSelect()" style="cursor: pointer;">' +
                  '<div class="panel-heading"><h4>{{ card.cardName }}</h4></div>' +
                  '<div class="panel-body">' +
                  '<p><strong>Type:</strong> {{ card.cardType }}</p>' +
                  '<p><strong>Last 4:</strong> **** {{ card.last4Digits }}</p>' +
                  '<p><strong>Limit:</strong> {{ card.creditLimit | currency }}</p>' +
                  '<p><strong>Available:</strong> {{ card.availableCredit | currency }}</p>' +
                  '</div>' +
                  '</div>'
      };
    }]);
})();