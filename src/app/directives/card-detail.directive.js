(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardDetail', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          spending: '='
        },
        template: '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">Card Details</h3></div><div class="panel-body"><p><strong>Card Number:</strong> <span card-mask>{{card.maskedNumber}}</span></p><p><strong>Card Type:</strong> {{card.cardType}}</p><p><strong>Credit Limit:</strong> {{card.creditLimit | currency:\'₹\'}}</p><p><strong>Available Credit:</strong> {{card.availableCredit | currency:\'₹\'}}</p><p><strong>Current Balance:</strong> {{card.currentBalance | currency:\'₹\'}}</p><p><strong>Outstanding Amount:</strong> {{card.outstandingAmount | currency:\'₹\'}}</p><p><strong>Utilization Rate:</strong> {{card.utilizationRate}}%</p><p><strong>Card Spending:</strong> {{spending | currency:\'₹\'}}</p></div></div>'
      };
    }]);
})();