(function() {
  'use strict';
  angular.module('app.dashboard').service('KPIAggregationService', ['$q', 'CreditCardDataService', 'TransactionSummaryService', function($q, CreditCardDataService, TransactionSummaryService) {
    this.getKPIs = function() {
      return $q.all([
        CreditCardDataService.getCardSummary(),
        TransactionSummaryService.getTransactionSummary()
      ]).then(function(results) {
        var cardSummary = results[0];
        var txnSummary = results[1];
        var utilizationPercentage = cardSummary.totalCreditLimit > 0 ? (txnSummary.totalOutstanding / cardSummary.totalCreditLimit * 100).toFixed(2) : 0;
        return {
          monthlySpend: txnSummary.currentMonthSpend,
          totalCreditLimit: cardSummary.totalCreditLimit,
          availableCredit: cardSummary.totalAvailableCredit,
          outstandingAmount: txnSummary.totalOutstanding,
          utilizationPercentage: utilizationPercentage,
          lastUpdated: new Date().toISOString()
        };
      });
    };
  }]);
})();