(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPIService', KPIService);
  KPIService.$inject = ['CreditCardService', 'TransactionService', '$http', '$q', '$cacheFactory'];
  function KPIService(CreditCardService, TransactionService, $http, $q, $cacheFactory) {
    var cache = $cacheFactory('kpiCache');
    var CACHE_KEY = 'dashboardKPIs';
    var CACHE_TTL = 300000;
    var service = {
      getKPIs: getKPIs
    };
    return service;
    function getKPIs() {
      var cached = cache.get(CACHE_KEY);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return $q.resolve(cached.data);
      }
      return $q.all({
        cards: CreditCardService.getAllCards(),
        transactions: TransactionService.getMonthlySpend()
      })
      .then(function(results) {
        var kpis = aggregateKPIs(results.cards, results.transactions);
        cache.put(CACHE_KEY, {
          data: kpis,
          timestamp: Date.now()
        });
        return kpis;
      });
    }
    function aggregateKPIs(cards, transactions) {
      var totalCreditLimit = 0;
      var availableCredit = 0;
      var totalOutstanding = 0;
      cards.forEach(function(card) {
        totalCreditLimit += card.creditLimit || 0;
        availableCredit += card.availableCredit || 0;
        totalOutstanding += card.outstandingAmount || 0;
      });
      var monthlySpend = transactions.totalSpend || 0;
      var utilizationRate = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;
      return {
        monthlySpend: monthlySpend,
        totalCreditLimit: totalCreditLimit,
        availableCredit: availableCredit,
        totalOutstanding: totalOutstanding,
        utilizationRate: utilizationRate,
        lastUpdated: new Date()
      };
    }
  }
})();