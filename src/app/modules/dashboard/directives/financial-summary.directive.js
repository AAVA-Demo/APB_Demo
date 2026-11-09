(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('financialSummary', ['KPIService', financialSummary]);
  function financialSummary(KPIService) {
    return {
      restrict: 'E',
      scope: {
        kpiData: '='
      },
      template: '<div class="panel panel-primary">' +
                '  <div class="panel-heading"><h3 class="panel-title">Financial Summary</h3></div>' +
                '  <div class="panel-body">' +
                '    <div class="row">' +
                '      <div class="col-sm-6"><strong>Total Credit Limit:</strong> ₹{{kpiData.totalCreditLimit | number:0}}</div>' +
                '      <div class="col-sm-6"><strong>Available Credit:</strong> ₹{{kpiData.availableCredit | number:0}}</div>' +
                '    </div>' +
                '    <div class="row" style="margin-top: 10px;">' +
                '      <div class="col-sm-6"><strong>Monthly Spend:</strong> ₹{{kpiData.monthlySpend | number:0}}</div>' +
                '      <div class="col-sm-6"><strong>Outstanding:</strong> ₹{{kpiData.outstandingAmount | number:0}}</div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();