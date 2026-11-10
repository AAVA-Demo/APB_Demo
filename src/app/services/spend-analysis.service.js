(function() {
  'use strict';
  angular.module('creditCardApp').service('SpendAnalysisService', ['$http', '$q', function($http, $q) {
    
    this.calculateComparisons = function(cards) {
      const deferred = $q.defer();
      
      if (!cards || cards.length === 0) {
        deferred.resolve(null);
        return deferred.promise;
      }
      
      const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
      const totalUtilization = cards.reduce((sum, card) => sum + (card.currentBalance / card.creditLimit * 100), 0) / cards.length;
      
      let highestSpendCard = cards[0];
      let lowestUtilizationCard = cards[0];
      
      cards.forEach(card => {
        if (card.monthlySpend > highestSpendCard.monthlySpend) {
          highestSpendCard = card;
        }
        if (card.utilizationRate < lowestUtilizationCard.utilizationRate) {
          lowestUtilizationCard = card;
        }
      });
      
      const comparison = {
        cards: cards,
        metrics: {
          totalCreditLimit: totalCreditLimit,
          totalUtilization: totalUtilization.toFixed(2),
          highestSpendCard: highestSpendCard.cardNumber,
          lowestUtilizationCard: lowestUtilizationCard.cardNumber,
          averageMonthlySpend: (cards.reduce((sum, c) => sum + c.monthlySpend, 0) / cards.length).toFixed(2)
        }
      };
      
      deferred.resolve(comparison);
      return deferred.promise;
    };
    
    this.getCardWiseAnalysis = function(cardId) {
      const deferred = $q.defer();
      
      const mockAnalysis = {
        cardId: cardId,
        categoryBreakdown: [
          { category: 'Food & Dining', amount: 450, percentage: 36 },
          { category: 'Fuel', amount: 300, percentage: 24 },
          { category: 'Shopping', amount: 250, percentage: 20 },
          { category: 'Entertainment', amount: 150, percentage: 12 },
          { category: 'Miscellaneous', amount: 100, percentage: 8 }
        ],
        monthlyTrend: [
          { month: 'Jan', spend: 1100 },
          { month: 'Feb', spend: 1050 },
          { month: 'Mar', spend: 1250 }
        ]
      };
      
      deferred.resolve(mockAnalysis);
      return deferred.promise;
    };
  }]);
})();