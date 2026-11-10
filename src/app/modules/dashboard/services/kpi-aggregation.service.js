(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('KPIAggregationService', ['$http', '$q', 'CreditCardDataFactory', function($http, $q, CreditCardDataFactory) {
      const API_BASE = 'https://api.example.com';
      this.fetchKPIData = function() {
        const deferred = $q.defer();
        const cardDataPromise = CreditCardDataFactory.getCards();
        const transactionPromise = $http.get(API_BASE + '/api/transactions/monthly').then(res => res.data).catch(() => ({monthlySpend: 0}));
        $q.all([cardDataPromise, transactionPromise]).then(function(results) {
          const cards = results[0];
          const transactionData = results[1];
          const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
          const outstandingAmount = cards.reduce((sum, card) => sum + card.currentBalance, 0);
          const availableCredit = totalCreditLimit - outstandingAmount;
          const monthlySpend = transactionData.monthlySpend || 0;
          const kpiData = {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            lastUpdated: new Date(),
            cards: cards
          };
          deferred.resolve(kpiData);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();