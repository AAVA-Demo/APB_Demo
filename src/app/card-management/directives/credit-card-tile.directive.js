(function() {
  'use strict';
  angular.module('cardManagementModule')
    .directive('creditCardTile', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-tile" ng-click="onSelect({card: card})"><div class="card-header"><span class="card-type">{{card.cardType}}</span><span class="card-status" ng-class="{active: card.status === \'active\', inactive: card.status === \'inactive\', blocked: card.status === \'blocked\'}">{{card.status}}</span></div><div class="card-number">{{card.cardNumber}}</div><div class="card-details"><div class="detail-item"><span class="label">Credit Limit:</span><span class="value">₹{{card.creditLimit | number:0}}</span></div><div class="detail-item"><span class="label">Available:</span><span class="value">₹{{card.availableCredit | number:0}}</span></div><div class="detail-item"><span class="label">Outstanding:</span><span class="value">₹{{card.outstandingBalance | number:0}}</span></div><div class="detail-item"><span class="label">Monthly Spend:</span><span class="value">₹{{card.monthlySpend | number:0}}</span></div></div><div class="card-footer">Expires: {{card.expiryDate}}</div></div>'
      };
    }]);
})();