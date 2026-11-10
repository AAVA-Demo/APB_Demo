(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardDetail', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-item" ng-if="card">' +
                  '  <h4>{{ card.issuer }} - {{ card.cardType }}</h4>' +
                  '  <p class="masked-number">{{ card.maskedCardNumber }}</p>' +
                  '  <p><strong>Expiry:</strong> {{ card.expiryDate }}</p>' +
                  '  <div class="row">' +
                  '    <div class="col-xs-6">' +
                  '      <p><strong>Credit Limit:</strong><br>{{ card.creditLimit | currency:"₹":0 }}</p>' +
                  '    </div>' +
                  '    <div class="col-xs-6">' +
                  '      <p><strong>Available:</strong><br>{{ card.availableCredit | currency:"₹":0 }}</p>' +
                  '    </div>' +
                  '  </div>' +
                  '  <div class="row">' +
                  '    <div class="col-xs-6">' +
                  '      <p><strong>Outstanding:</strong><br>{{ card.outstandingAmount | currency:"₹":0 }}</p>' +
                  '    </div>' +
                  '    <div class="col-xs-6">' +
                  '      <p><strong>This Month:</strong><br>{{ card.currentMonthSpend | currency:"₹":0 }}</p>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    }]);
})();