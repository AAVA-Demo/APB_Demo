(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardManagementService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      var self = this;
      self.getUserCards = function(userId) {
        return $http.get('/api/cards/portfolio?userId=' + userId)
          .then(function(response) {
            var portfolio = response.data;
            var promises = portfolio.cards.map(function(card) {
              return self.getCardSpendAnalysis(card.cardId).then(function(analysis) {
                card.spendAnalysis = analysis;
                return card;
              });
            });
            return $q.all(promises).then(function() {
              return portfolio;
            });
          })
          .catch(function() {
            return {
              userId: userId,
              cards: [
                {
                  cardId: 'card-001',
                  cardNumber: '**** **** **** 1234',
                  cardType: 'Visa',
                  cardIssuer: 'Chase',
                  creditLimit: 15000,
                  availableCredit: 10500,
                  outstandingBalance: 4500,
                  monthlySpend: 2100,
                  lastSyncDate: new Date(),
                  spendAnalysis: {
                    currentMonthSpend: 2100,
                    previousMonthSpend: 1950,
                    spendTrend: 'up',
                    topCategories: [{ category: 'Shopping', amount: 850 }, { category: 'Food & Dining', amount: 650 }]
                  }
                },
                {
                  cardId: 'card-002',
                  cardNumber: '**** **** **** 5678',
                  cardType: 'MasterCard',
                  cardIssuer: 'Citi',
                  creditLimit: 20000,
                  availableCredit: 15200,
                  outstandingBalance: 4800,
                  monthlySpend: 1850,
                  lastSyncDate: new Date(),
                  spendAnalysis: {
                    currentMonthSpend: 1850,
                    previousMonthSpend: 2100,
                    spendTrend: 'down',
                    topCategories: [{ category: 'Travel', amount: 900 }, { category: 'Fuel', amount: 450 }]
                  }
                },
                {
                  cardId: 'card-003',
                  cardNumber: '**** **** **** 9012',
                  cardType: 'Amex',
                  cardIssuer: 'American Express',
                  creditLimit: 15000,
                  availableCredit: 12000,
                  outstandingBalance: 3000,
                  monthlySpend: 300,
                  lastSyncDate: new Date(),
                  spendAnalysis: {
                    currentMonthSpend: 300,
                    previousMonthSpend: 280,
                    spendTrend: 'stable',
                    topCategories: [{ category: 'Utilities', amount: 150 }, { category: 'Entertainment', amount: 100 }]
                  }
                }
              ],
              totalCreditLimit: 50000,
              totalAvailableCredit: 37700,
              totalOutstanding: 12300
            };
          });
      };
      self.getCardSpendAnalysis = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/spend-analysis')
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return {
              cardId: cardId,
              currentMonthSpend: 0,
              previousMonthSpend: 0,
              spendTrend: 'stable',
              topCategories: []
            };
          });
      };
    }]);
})();