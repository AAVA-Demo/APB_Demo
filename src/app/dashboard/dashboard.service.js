(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['CreditCardDataFactory', 'TransactionFactory', '$q', function(CreditCardDataFactory, TransactionFactory, $q) {
      var cachedKPIs = null;
      var cacheTimestamp = null;
      var CACHE_TTL = 30000;
      this.getKPIs = function() {
        var now = new Date().getTime();
        if (cachedKPIs && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
          return $q.resolve(cachedKPIs);
        }
        var deferred = $q.defer();
        $q.all([
          CreditCardDataFactory.fetchAllCards(),
          TransactionFactory.fetchMonthlySpend()
        ]).then(function(results) {
          var cards = results[0].data;
          var monthlySpendData = results[1].data;
          var totalCreditLimit = 0;
          var availableCredit = 0;
          var outstandingAmount = 0;
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit;
            availableCredit += card.availableCredit;
            outstandingAmount += card.outstandingAmount;
          });
          var kpis = {
            monthlySpend: monthlySpendData.monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            lastUpdated: new Date()
          };
          cachedKPIs = kpis;
          cacheTimestamp = now;
          deferred.resolve(kpis);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();