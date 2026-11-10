(function() {
  'use strict';
  angular.module('cardManagementModule').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&'
      },
      template: '<div class="row">' +
                '  <div class="col-md-4 col-sm-6 col-xs-12" ng-repeat="card in cards">' +
                '    <div class="card-item" ng-click="selectCard(card)" ng-class="{selected: card.cardId === selectedCardId}">' +
                '      <div class="card-number">{{card.cardNumber}}</div>' +
                '      <div class="card-type">{{card.cardType}}</div>' +
                '      <div class="card-bank">{{card.bankName}}</div>' +
                '      <div class="card-metrics">' +
                '        <div class="metric">' +
                '          <div class="metric-label">Credit Limit</div>' +
                '          <div class="metric-value">{{card.creditLimit | currency:"$":0}}</div>' +
                '        </div>' +
                '        <div class="metric">' +
                '          <div class="metric-label">Available</div>' +
                '          <div class="metric-value">{{card.availableCredit | currency:"$":0}}</div>' +
                '        </div>' +
                '      </div>' +
                '      <div class="utilization-bar">' +
                '        <div class="utilization-fill" ng-style="{width: card.utilizationPercent + \'%\'}"></div>' +
                '      </div>' +
                '      <div style="margin-top: 5px; font-size: 12px; color: #666;">{{card.utilizationPercent}}% utilized</div>' +
                '    </div>' +
                '  </div>' +
                '</div>',
      link: function(scope) {
        scope.selectedCardId = null;
        scope.selectCard = function(card) {
          scope.selectedCardId = card.cardId;
          if (scope.onSelect) {
            scope.onSelect({ cardId: card.cardId });
          }
        };
      }
    };
  }]);
})();