(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPIService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getKPIMetrics = function() {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCardsSummary)
          .then(function(response) {
            var cards = response.data.cards || [];
            return self.calculateMetrics(cards);
          })
          .catch(function() {
            var mockCards = [
              { cardId: 'card1', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000 },
              { cardId: 'card2', creditLimit: 30000, availableCredit: 20000, outstandingAmount: 10000 },
              { cardId: 'card3', creditLimit: 20000, availableCredit: 15000, outstandingAmount: 5000 }
            ];
            return self.calculateMetrics(mockCards);
          });
      };
      self.calculateMetrics = function(cards) {
        var totalCreditLimit = 0;
        var totalAvailableCredit = 0;
        var totalOutstanding = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          totalAvailableCredit += card.availableCredit || 0;
          totalOutstanding += card.outstandingAmount || 0;
        });
        var monthlySpend = totalCreditLimit - totalAvailableCredit;
        var utilizationPercentage = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(2) : 0;
        return {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          utilizationPercentage: utilizationPercentage,
          lastRefreshed: new Date()
        };
      };
    }]);
})();