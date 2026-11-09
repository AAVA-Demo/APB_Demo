(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardComparisonView', ['CardComparisonService', cardComparisonView]);
  function cardComparisonView(CardComparisonService) {
    return {
      restrict: 'E',
      scope: {
        comparisonData: '='
      },
      template: '<div class="comparison-table">' +
                '  <h3>Card Comparison</h3>' +
                '  <div class="panel panel-info">' +
                '    <div class="panel-heading">Summary Metrics</div>' +
                '    <div class="panel-body">' +
                '      <div class="row">' +
                '        <div class="col-sm-3"><strong>Total Credit Limit:</strong><br>₹{{comparisonData.metrics.totalCreditLimit | number:0}}</div>' +
                '        <div class="col-sm-3"><strong>Total Available:</strong><br>₹{{comparisonData.metrics.totalAvailableCredit | number:0}}</div>' +
                '        <div class="col-sm-3"><strong>Total Outstanding:</strong><br>₹{{comparisonData.metrics.totalOutstanding | number:0}}</div>' +
                '        <div class="col-sm-3"><strong>Avg Utilization:</strong><br>{{comparisonData.metrics.averageUtilization | number:1}}%</div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <table class="table table-striped table-bordered">' +
                '    <thead>' +
                '      <tr>' +
                '        <th>Bank</th>' +
                '        <th>Card Type</th>' +
                '        <th>Credit Limit</th>' +
                '        <th>Available Credit</th>' +
                '        <th>Outstanding</th>' +
                '        <th>Monthly Spend</th>' +
                '        <th>Utilization %</th>' +
                '      </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '      <tr ng-repeat="card in comparisonData.cards">' +
                '        <td>{{card.bankName}}</td>' +
                '        <td>{{card.cardType}}</td>' +
                '        <td>₹{{card.creditLimit | number:0}}</td>' +
                '        <td>₹{{card.availableCredit | number:0}}</td>' +
                '        <td>₹{{card.outstandingBalance | number:0}}</td>' +
                '        <td>₹{{card.monthlySpend | number:0}}</td>' +
                '        <td>{{(card.outstandingBalance/card.creditLimit*100) | number:1}}%</td>' +
                '      </tr>' +
                '    </tbody>' +
                '  </table>' +
                '</div>'
    };
  }
})();