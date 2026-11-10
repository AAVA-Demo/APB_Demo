(function() {
  'use strict';
  angular.module('app.cardManagement').directive('cardSelector', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&'
      },
      template: '<div class="list-group">' +
                '  <a ng-repeat="card in cards" class="list-group-item card-item" ng-click="selectCard(card)">' +
                '    <div class="row">' +
                '      <div class="col-xs-2 text-center">' +
                '        <i class="glyphicon glyphicon-credit-card" style="font-size: 32px; color: #3498db;"></i>' +
                '      </div>' +
                '      <div class="col-xs-10">' +
                '        <h4 class="list-group-item-heading">{{card.cardType}} - <span class="card-number">{{card.cardNumber}}</span></h4>' +
                '        <p class="list-group-item-text">' +
                '          <strong>Balance:</strong> {{card.currentBalance | currency}} | ' +
                '          <strong>Available:</strong> {{card.availableCredit | currency}} | ' +
                '          <strong>Limit:</strong> {{card.creditLimit | currency}}' +
                '        </p>' +
                '      </div>' +
                '    </div>' +
                '  </a>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.selectCard = function(card) {
          if (scope.onSelect) {
            scope.onSelect({card: card});
          }
        };
      }
    };
  }]);
})();