(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['CreditCardDataFactory', 'TransactionFactory', '$q', function(CreditCardDataFactory, TransactionFactory, $q) {
      var vm = this;
      vm.cache = null;
      vm.cacheTimestamp = null;
      vm.getKPIData = function() {
        var now = Date.now();
        if (vm.cache && vm.cacheTimestamp && (now - vm.cacheTimestamp < 5000)) {
          return $q.resolve(vm.cache);
        }
        var promises = {
          cardSummary: CreditCardDataFactory.getSummary(),
          monthlySpend: TransactionFactory.getMonthlySpend()
        };
        return $q.all(promises).then(function(results) {
          var cardSummary = results.cardSummary;
          var monthlySpend = results.monthlySpend;
          var kpiData = {
            monthlySpend: monthlySpend.currentMonthSpend || 0,
            totalCreditLimit: cardSummary.totalLimit || 0,
            totalOutstanding: cardSummary.totalOutstanding || 0,
            availableCredit: (cardSummary.totalLimit || 0) - (cardSummary.totalOutstanding || 0)
          };
          vm.cache = kpiData;
          vm.cacheTimestamp = now;
          return kpiData;
        });
      };
    }]);
})();