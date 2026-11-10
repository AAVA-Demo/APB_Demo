(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardComparison', [function() {
    return {
      restrict: 'E',
      scope: {
        comparison: '=',
        selectedCard: '='
      },
      template: '<div class="kpi-card"><h4>Portfolio Summary</h4><div ng-if="comparison"><ul class="list-unstyled"><li><strong>Total Credit Limit:</strong> ${{comparison.metrics.totalCreditLimit.toFixed(2)}}</li><li><strong>Average Utilization:</strong> {{comparison.metrics.totalUtilization}}%</li><li><strong>Highest Spend Card:</strong> {{comparison.metrics.highestSpendCard}}</li><li><strong>Lowest Utilization:</strong> {{comparison.metrics.lowestUtilizationCard}}</li><li><strong>Avg Monthly Spend:</strong> ${{comparison.metrics.averageMonthlySpend}}</li></ul></div><div ng-if="!comparison" class="text-muted">No comparison data available</div><hr ng-if="selectedCard"><div ng-if="selectedCard"><h5>Selected Card Details</h5><p><strong>{{selectedCard.cardType}}</strong></p><p>{{selectedCard.cardNumber}}</p><ul class="list-unstyled"><li>Balance: ${{selectedCard.currentBalance.toFixed(2)}}</li><li>Available: ${{selectedCard.availableCredit.toFixed(2)}}</li><li>Utilization: {{selectedCard.utilizationRate}}%</li></ul></div></div>',
      link: function(scope, element, attrs) {
      }
    };
  }]);
})();