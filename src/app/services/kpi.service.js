(function() {
  'use strict';
  angular.module('creditCardApp').service('KPIService', KPIService);
  KPIService.$inject = ['$http', '$q', '$rootScope'];
  function KPIService($http, $q, $rootScope) {
    var service = this;
    service.getConsolidatedKPIs = getConsolidatedKPIs;
    function getConsolidatedKPIs() {
      var cardSummaryPromise = $http.get($rootScope.apiBaseUrl + '/api/cards/summary');
      var monthlySpendPromise = $http.get($rootScope.apiBaseUrl + '/api/transactions/monthly-spend');
      return $q.all([cardSummaryPromise, monthlySpendPromise]).then(function(responses) {
        var cardSummary = responses[0].data;
        var monthlySpend = responses[1].data;
        return {
          monthlySpend: monthlySpend.amount || 0,
          totalCreditLimit: cardSummary.totalCreditLimit || 0,
          availableCredit: cardSummary.availableCredit || 0,
          outstandingAmount: cardSummary.outstandingAmount || 0,
          utilizationPercentage: cardSummary.totalCreditLimit > 0 ? 
            ((cardSummary.outstandingAmount / cardSummary.totalCreditLimit) * 100).toFixed(2) : 0,
          lastUpdated: new Date()
        };
      }).catch(function(error) {
        console.error('Error fetching KPIs:', error);
        return $q.reject(error);
      });
    }
  }
})();