(function() {
  'use strict';
  angular.module('creditCard.dashboard').service('DashboardService', ['$q', 'CreditCardFactory', 'TransactionService', 'KPICalculationService', function($q, CreditCardFactory, TransactionService, KPICalculationService) {
    var self = this;
    self.loadKPIs = function() {
      var deferred = $q.defer();
      $q.all([
        CreditCardFactory.getAllCards(),
        TransactionService.getMonthlySpend()
      ]).then(function(results) {
        var cardSummaries = results[0];
        var monthlySpend = results[1];
        var kpiData = KPICalculationService.calculateKPIs(cardSummaries, monthlySpend);
        deferred.resolve(kpiData);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();