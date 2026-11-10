(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardItem', cardItem);
  function cardItem() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&'
      },
      template: '<div class="panel panel-default card-item" ng-click="onSelect()">' +
                '  <div class="panel-body">' +
                '    <div class="card-brand">{{card.cardBrand}}</div>' +
                '    <div class="card-number">{{card.cardNumber}}</div>' +
                '    <div class="card-type">{{card.cardType}}</div>' +
                '    <div class="card-balance">' +
                '      <span class="label">Available:</span> ' +
                '      <span class="amount">{{card.availableCredit | currency}}</span>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();