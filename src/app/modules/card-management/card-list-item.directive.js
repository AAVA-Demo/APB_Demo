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
        template: `
          <div class="card-item panel panel-primary" ng-click="selectCard()">
            <div class="panel-heading">
              <h3 class="panel-title">{{card.cardType}} - {{card.cardNumber}}</h3>
            </div>
            <div class="panel-body">
              <p><strong>Card Holder:</strong> {{card.cardHolderName}}</p>
              <p><strong>Expiry:</strong> {{card.expiryDate}}</p>
              <p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p>
              <p><strong>Available Credit:</strong> {{card.availableCredit | currency}}</p>
              <p><strong>Outstanding:</strong> {{card.outstandingAmount | currency}}</p>
              <p><strong>Last Transaction:</strong> {{card.lastTransactionDate | date:'short'}}</p>
            </div>
          </div>
        `,
        link: function(scope) {
          scope.selectCard = function() {
            scope.onSelect({card: scope.card});
          };
        }
      };
    }]);
})();