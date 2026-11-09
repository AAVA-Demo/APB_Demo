(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('KPIService', ['CreditCardDataService', 'TransactionService', '$q', KPIService]);
  function KPIService(CreditCardDataService, TransactionService, $q) {
    const service = {
      fetchKPIs: fetchKPIs
    };
    return service;
    function fetchKPIs() {
      return $q.all({
        cardSummary: CreditCardDataService.getCreditCardSummary(),
        transactions: TransactionService.getCurrentMonthTransactions()
      }).then(function(results) {
        const cardSummary = results.cardSummary;
        const transactions = results.transactions;
        const monthlySpend = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
        const kpiData = {
          monthlySpend: monthlySpend,
          totalCreditLimit: cardSummary.totalCreditLimit,
          availableCredit: cardSummary.totalAvailableCredit,
          outstandingAmount: cardSummary.totalOutstanding,
          creditUtilization: cardSummary.totalCreditLimit > 0 ? (cardSummary.totalOutstanding / cardSummary.totalCreditLimit) * 100 : 0,
          lastUpdated: new Date()
        };
        return kpiData;
      });
    }
  }
})();