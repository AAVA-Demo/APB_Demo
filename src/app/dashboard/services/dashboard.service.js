(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['$q', 'CreditCardDataService', 'TransactionProcessingService', function($q, CreditCardDataService, TransactionProcessingService) {
      var service = this;
      service.getKPIs = function() {
        var deferred = $q.defer();
        $q.all({
          cards: CreditCardDataService.getAllCards(),
          summary: TransactionProcessingService.getMonthlySpend()
        })
        .then(function(results) {
          var cards = results.cards || [];
          var summary = results.summary || {};
          var totalCreditLimit = 0;
          var totalOutstanding = 0;
          var availableCredit = 0;
          angular.forEach(cards, function(card) {
            totalCreditLimit += card.creditLimit || 0;
            totalOutstanding += card.outstandingAmount || 0;
            availableCredit += card.availableCredit || 0;
          });
          var kpis = {
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            totalOutstanding: totalOutstanding,
            monthlySpend: summary.monthlySpend || 0,
            creditUtilization: totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(2) : 0
          };
          deferred.resolve({ kpis: kpis, cards: cards });
        })
        .catch(function(error) {
          console.error('Error aggregating KPIs:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();