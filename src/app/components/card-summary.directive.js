(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardSummary', function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-summary panel panel-info">' +
                  '  <div class="panel-heading">' +
                  '    <h4>{{ card.cardType }} - {{ card.cardNumber }}</h4>' +
                  '  </div>' +
                  '  <div class="panel-body">' +
                  '    <p><strong>Cardholder:</strong> {{ card.cardholderName }}</p>' +
                  '    <p><strong>Credit Limit:</strong> ${{ card.creditLimit | number:2 }}</p>' +
                  '    <p><strong>Available Credit:</strong> ${{ card.availableCredit | number:2 }}</p>' +
                  '    <p><strong>Outstanding:</strong> ${{ card.outstandingAmount | number:2 }}</p>' +
                  '    <div class="progress">' +
                  '      <div class="progress-bar" ng-style="{width: ((card.outstandingAmount / card.creditLimit) * 100) + \'%\'}">' +
                  '        {{ ((card.outstandingAmount / card.creditLimit) * 100) | number:0 }}%' +
                  '      </div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();