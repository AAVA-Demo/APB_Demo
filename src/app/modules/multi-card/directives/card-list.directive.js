(function() {
  'use strict';
  angular.module('creditCard.multiCard').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&',
        onDetail: '&'
      },
      template: '<div class="card-item" ng-repeat="card in cards track by card.cardId"><div class="row"><div class="col-md-8"><div class="card-number">{{card.cardType}} {{card.cardNumber}}</div><p style="margin: 5px 0;">Credit Limit: ₹{{card.creditLimit | number}}</p><p style="margin: 5px 0;">Outstanding: ₹{{card.outstandingBalance | number}}</p><div class="utilization-bar"><div class="utilization-fill" ng-style="{width: card.utilizationRate + \'%\'}"></div></div><p style="margin-top: 5px; font-size: 12px;">Utilization: {{card.utilizationRate}}%</p></div><div class="col-md-4 text-right"><button class="btn btn-sm btn-info" ng-click="onDetail({card: card})">View Details</button><br><label style="margin-top: 10px;"><input type="checkbox" ng-click="onSelect({card: card})"> Compare</label></div></div></div>'
    };
  }]);
})();