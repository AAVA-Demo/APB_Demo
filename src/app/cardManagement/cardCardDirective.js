(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardCard', [function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&'
      },
      template: '<div class="card-item" ng-click="onSelect({cardId: card.cardId})">' +
                '  <div class="row">' +
                '    <div class="col-xs-8">' +
                '      <div class="card-number">{{card.cardNumber}}</div>' +
                '      <div><small>{{card.cardHolderName}}</small></div>' +
                '      <span class="card-status" ng-class="{\"status-active\": card.status === \"Active\"}">{{card.status}}</span>' +
                '    </div>' +
                '    <div class="col-xs-4 text-right">' +
                '      <div><strong>Limit:</strong> ₹{{card.creditLimit | number:2}}</div>' +
                '      <div><strong>Available:</strong> ₹{{card.availableCredit | number:2}}</div>' +
                '      <div><strong>Outstanding:</strong> ₹{{card.outstandingBalance | number:2}}</div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }]);
})();