(function() {
  'use strict';
  angular.module('cc.dashboard')
    .service('DashboardService', ['$q', 'CreditCardDataFactory', 'TransactionDataFactory', 'KpiCalculationService', DashboardService]);
  function DashboardService($q, CreditCardDataFactory, TransactionDataFactory, KpiCalculationService) {
    var cache = null;
    var cacheTime = null;
    var CACHE_DURATION = 120000;
    this.loadKpis = function() {
      var now = Date.now();
      if (cache && cacheTime && (now - cacheTime < CACHE_DURATION)) {
        return $q.resolve(cache);
      }
      return $q.all([
        CreditCardDataFactory.getCards(),
        TransactionDataFactory.getCurrentMonthTransactions()
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        var kpis = KpiCalculationService.calculateKpis(cards, transactions);
        cache = kpis;
        cacheTime = now;
        return kpis;
      });
    };
  }
})();