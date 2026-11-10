(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardList', [cardList]);
  function cardList() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&'
      },
      template: '<div class="card-list">' +
                '  <div class="card-item" ng-repeat="card in cards" ng-click="onSelect({cardId: card.cardId})">' +
                '    <div class="card-header">' +
                '      <h4>{{card.cardLabel || card.cardType}}</h4>' +
                '      <span class="card-number">{{card.cardNumber}}</span>' +
                '    </div>' +
                '    <div class="card-body">' +
                '      <div class="card-metric">' +
                '        <span class="label">Credit Limit:</span>' +
                '        <span class="value">{{card.creditLimit | currency}}</span>' +
                '      </div>' +
                '      <div class="card-metric">' +
                '        <span class="label">Available Credit:</span>' +
                '        <span class="value">{{card.availableCredit | currency}}</span>' +
                '      </div>' +
                '      <div class="card-metric">' +
                '        <span class="label">Outstanding Balance:</span>' +
                '        <span class="value">{{card.outstandingBalance | currency}}</span>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();