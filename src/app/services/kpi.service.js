(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['$http', '$q', '$cacheFactory', 'CreditCardFactory', 'TransactionFactory', function($http, $q, $cacheFactory, CreditCardFactory, TransactionFactory) {
      var cache = $cacheFactory('kpiCache');
      var CACHE_TTL = 300000;
      this.getKPIs = function(userId) {
        var cacheKey = 'kpis_' + userId;
        var cached = cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        var promises = {
          cards: CreditCardFactory.getCardSummary(userId),
          transactions: TransactionFactory.getMonthlyTotal(userId)
        };
        return $q.all(promises).then(function(results) {
          var cards = results.cards || [];
          var totalCreditLimit = cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0);
          var outstandingAmount = cards.reduce(function(sum, card) { return sum + (card.outstandingAmount || 0); }, 0);
          var kpis = {
            userId: userId,
            monthlySpend: results.transactions.monthlySpend || 0,
            totalCreditLimit: totalCreditLimit,
            availableCredit: totalCreditLimit - outstandingAmount,
            outstandingAmount: outstandingAmount,
            lastUpdated: new Date()
          };
          cache.put(cacheKey, { data: kpis, timestamp: Date.now() });
          return kpis;
        }).catch(function(error) {
          console.error('KPI fetch error:', error);
          return $q.reject(error);
        });
      };
    }]);
})();