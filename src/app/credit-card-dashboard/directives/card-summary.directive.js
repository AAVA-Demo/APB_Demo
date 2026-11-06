(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .directive('cardSummary', cardSummary);

  function cardSummary() {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      template: '<div class="card-summary">' +
                '  <div class="card-number">{{card.cardNumber}}</div>' +
                '  <div style="margin-top:10px; color:#666;">{{card.cardType}}</div>' +
                '  <hr>' +
                '  <div class="row">' +
                '    <div class="col-xs-6">' +
                '      <div class="kpi-label">Credit Limit</div>' +
                '      <div style="font-size:18px; font-weight:bold;">{{card.creditLimit | currency}}</div>' +
                '    </div>' +
                '    <div class="col-xs-6">' +
                '      <div class="kpi-label">Available</div>' +
                '      <div style="font-size:18px; font-weight:bold; color:#5cb85c;">{{card.availableCredit | currency}}</div>' +
                '    </div>' +
                '  </div>' +
                '  <div class="row" style="margin-top:10px;">' +
                '    <div class="col-xs-12">' +
                '      <div class="kpi-label">Outstanding Amount</div>' +
                '      <div style="font-size:18px; font-weight:bold; color:#d9534f;">{{card.outstandingAmount | currency}}</div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();