(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .service('dashboardService', ['cardDataFactory', 'transactionDataFactory', 'kpiCalculationService', '$q', dashboardService]);

  function dashboardService(cardDataFactory, transactionDataFactory, kpiCalculationService, $q) {
    this.getDashboardKPIs = function() {
      var deferred = $q.defer();
      $q.all([
        cardDataFactory.getCards(),
        transactionDataFactory.getTransactions()
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        var kpis = kpiCalculationService.calculateKPIs(cards, transactions);
        deferred.resolve(kpis);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }
})();