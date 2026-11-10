(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .factory('DashboardService', ['$q', 'CreditCardDataService', 'KPICalculationService', DashboardService]);

  function DashboardService($q, CreditCardDataService, KPICalculationService) {
    return {
      getKPIs: getKPIs
    };

    function getKPIs(forceRefresh) {
      return CreditCardDataService.fetchUserCards(forceRefresh)
        .then(function(creditCards) {
          return KPICalculationService.calculateKPIs(creditCards);
        })
        .catch(function(error) {
          console.error('Error getting KPIs:', error);
          return $q.reject(error);
        });
    }
  }
})();