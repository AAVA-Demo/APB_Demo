(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .service('DashboardService', ['$q', 'CreditCardDataService', 'TransactionProcessingService', 'KPICalculationFactory', DashboardService]);
  function DashboardService($q, CreditCardDataService, TransactionProcessingService, KPICalculationFactory) {
    var vm = this;
    vm.getKPIs = function() {
      var promises = {
        cards: CreditCardDataService.getAllCards(),
        monthlyData: TransactionProcessingService.getMonthlyData()
      };
      return $q.all(promises)
        .then(function(results) {
          return KPICalculationFactory.calculate(results.cards, results.monthlyData);
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
  }
})();