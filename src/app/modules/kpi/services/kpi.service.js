(function() {
  'use strict';
  angular.module('creditCardApp.kpi').service('KpiService', ['TransactionService', 'CreditCardService', 'AggregationService', '$q', function(TransactionService, CreditCardService, AggregationService, $q) {
    var service = this;
    service.getKpiData = function(userId) {
      var promises = {
        monthlySpend: TransactionService.getMonthlySpend(userId),
        cardFinancials: CreditCardService.getCardFinancials(userId)
      };
      return $q.all(promises).then(function(results) {
        var monthlySpendData = results.monthlySpend;
        var cardFinancials = results.cardFinancials;
        var aggregated = AggregationService.aggregateMetrics(cardFinancials);
        return {
          monthlySpend: monthlySpendData.totalSpend || 0,
          totalCreditLimit: aggregated.totalCreditLimit,
          availableCredit: aggregated.availableCredit,
          outstandingAmount: aggregated.outstandingAmount,
          lastRefreshed: new Date()
        };
      }).catch(function(error) {
        console.error('Error fetching KPI data:', error);
        throw error;
      });
    };
  }]);
  KpiService.$inject = ['TransactionService', 'CreditCardService', 'AggregationService', '$q'];
})();