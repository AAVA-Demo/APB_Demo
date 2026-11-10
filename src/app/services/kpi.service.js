(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPIService', ['$http', '$q', 'CreditCardDataService', function($http, $q, CreditCardDataService) {
      var cache = null;
      var cacheTime = null;
      var CACHE_DURATION = 300000;
      this.getKPIs = function() {
        if (cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
          return $q.resolve(cache);
        }
        return CreditCardDataService.fetchAllCards().then(function(cards) {
          var totalCreditLimit = 0;
          var outstandingAmount = 0;
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            outstandingAmount += card.outstandingAmount || 0;
          });
          var availableCredit = totalCreditLimit - outstandingAmount;
          return $http.get('/api/transactions', {
            params: {month: 'current'},
            cache: true
          }).then(function(response) {
            var transactions = response.data || [];
            var monthlySpend = transactions.reduce(function(sum, txn) {
              return sum + (txn.amount || 0);
            }, 0);
            var kpiData = {
              monthlySpend: monthlySpend,
              totalCreditLimit: totalCreditLimit,
              availableCredit: availableCredit,
              outstandingAmount: outstandingAmount,
              lastUpdated: new Date()
            };
            cache = kpiData;
            cacheTime = Date.now();
            return kpiData;
          });
        });
      };
      this.invalidateCache = function() {
        cache = null;
        cacheTime = null;
      };
    }]);
})();