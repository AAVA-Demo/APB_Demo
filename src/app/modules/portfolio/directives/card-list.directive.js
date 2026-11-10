(function() {
  'use strict';
  angular.module('app.portfolio')
    .directive('cardList', function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&'
        },
        template: '<div class="row">' +
                  '  <div class="col-md-4 col-sm-6 mb-3" ng-repeat="card in cards track by card.cardId">' +
                  '    <div class="card card-item" ng-click="selectCard(card)">' +
                  '      <div class="card-body">' +
                  '        <h5 class="card-title">{{card.cardName}}</h5>' +
                  '        <p class="card-text"><small class="text-muted">{{card.cardNumber}}</small></p>' +
                  '        <div class="mb-2">' +
                  '          <strong>Credit Limit:</strong> {{card.creditLimit | currency}}<br>' +
                  '          <strong>Balance:</strong> {{card.currentBalance | currency}}<br>' +
                  '          <strong>Available:</strong> {{card.availableCredit | currency}}' +
                  '        </div>' +
                  '        <div class="utilization-bar">' +
                  '          <div class="utilization-fill bg-primary" ng-style="{width: card.utilizationPercentage + \'%\'}"></div>' +
                  '        </div>' +
                  '        <small class="text-muted">Utilization: {{card.utilizationPercentage}}%</small>' +
                  '      </div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>',
        link: function(scope) {
          scope.selectCard = function(card) {
            scope.onSelect({card: card});
          };
        }
      };
    });
})();