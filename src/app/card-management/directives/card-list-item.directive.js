(function() {
  'use strict';
  angular.module('app.cardManagement').directive('cardListItem', [function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        selected: '=',
        onSelect: '&'
      },
      template: '<div class="card-item" ng-class="{selected: selected}" ng-click="onSelect({cardId: card.cardId})"><div class="card-number">{{card.cardNumber}}</div><div class="card-issuer">{{card.issuer}}</div><div><strong>Available:</strong> {{card.availableCredit | currency}}</div><div><span class="label" ng-class="{\"label-success\": card.status === \"Active\", \"label-danger\": card.status !== \"Active\"}">{{card.status}}</span></div></div>'
    };
  }]);
})();