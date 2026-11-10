(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIAggregationService', ['CardDataService', 'TransactionService', '$q', function(CardDataService, TransactionService, $q) {
      var cache = {};
      this.fetchKPIs = function() {
        if (cache.data && (Date.now() - cache.timestamp < 30000)) {
          return $q.resolve(cache.data);
        }
        return $q.all({
          balances: CardDataService.getCardBalances(),
          monthlySpend: TransactionService.getMonthlySpend()
        }).then(function(results) {
          var totalCreditLimit = 0;
          var availableCredit = 0;
          var outstandingAmount = 0;
          angular.forEach(results.balances, function(card) {
            totalCreditLimit += card.creditLimit;
            availableCredit += card.availableCredit;
            outstandingAmount += card.outstandingAmount;
          });
          var kpiData = {
            monthlySpend: results.monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            utilizationRate: totalCreditLimit > 0 ? ((totalCreditLimit - availableCredit) / totalCreditLimit * 100).toFixed(2) : 0,
            lastRefreshed: new Date()
          };
          cache.data = kpiData;
          cache.timestamp = Date.now();
          return kpiData;
        });
      };
    }]);
})();