(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPICalculationService', ['$http', '$q', 'API_BASE_URL', KPICalculationService]);

  function KPICalculationService($http, $q, API_BASE_URL) {
    return {
      calculateKPIs: calculateKPIs
    };

    function calculateKPIs(creditCards) {
      var totalCreditLimit = creditCards.reduce(function(sum, card) {
        return sum + (card.creditLimit || 0);
      }, 0);
      var totalOutstanding = creditCards.reduce(function(sum, card) {
        return sum + (card.currentBalance || 0);
      }, 0);
      var totalAvailableCredit = creditCards.reduce(function(sum, card) {
        return sum + (card.availableCredit || 0);
      }, 0);

      return $http.get(API_BASE_URL + '/transactions/monthly')
        .then(function(response) {
          var monthlySpend = response.data.reduce(function(sum, txn) {
            return sum + (txn.amount || 0);
          }, 0);
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            cardCount: creditCards.length,
            lastRefreshTime: new Date()
          };
        })
        .catch(function(error) {
          console.error('Error calculating KPIs:', error);
          return {
            monthlySpend: 0,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            cardCount: creditCards.length,
            lastRefreshTime: new Date()
          };
        });
    }
  }
})();