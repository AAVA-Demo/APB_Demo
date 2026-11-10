(function() {
  'use strict';
  angular.module('dashboardModule').directive('creditcardSummary', creditcardSummary);
  function creditcardSummary() {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      template: '<div class="card-summary"><h4>{{card.cardName}} <small>{{card.cardNumber}}</small></h4><div class="row"><div class="col-sm-3"><strong>Credit Limit:</strong> ₹{{card.creditLimit | number:0}}</div><div class="col-sm-3"><strong>Outstanding:</strong> ₹{{card.outstandingAmount | number:0}}</div><div class="col-sm-3"><strong>Available:</strong> ₹{{card.availableCredit | number:0}}</div><div class="col-sm-3"><strong>Monthly Spend:</strong> ₹{{card.monthlySpend | number:0}}</div></div></div>'
    };
  }
})();