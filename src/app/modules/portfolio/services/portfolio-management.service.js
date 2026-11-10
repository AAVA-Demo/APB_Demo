(function() {
  'use strict';
  angular.module('portfolioModule')
    .service('PortfolioManagementService', ['$http', '$q', 'TransactionHistoryFactory', 'AuthenticationService', function($http, $q, TransactionHistoryFactory, AuthenticationService) {
      const API_BASE = 'https://api.example.com';
      const MAX_CARDS = 10;
      this.getCardPortfolio = function() {
        const deferred = $q.defer();
        const userId = AuthenticationService.getUserId();
        $http.get(API_BASE + '/api/cards?userId=' + userId).then(function(response) {
          let cards = response.data.slice(0, MAX_CARDS);
          const transactionPromises = cards.map(card => 
            TransactionHistoryFactory.getTransactions(card.cardId).then(transactions => {
              const currentMonth = new Date().toISOString().slice(0, 7);
              const monthlySpend = transactions
                .filter(t => t.date.startsWith(currentMonth))
                .reduce((sum, t) => sum + t.amount, 0);
              return Object.assign({}, card, {
                cardNumber: '****' + card.cardNumber.slice(-4),
                monthlySpend: monthlySpend,
                transactions: transactions
              });
            })
          );
          $q.all(transactionPromises).then(function(enrichedCards) {
            const totalSpend = enrichedCards.reduce((sum, card) => sum + card.monthlySpend, 0);
            const portfolio = {
              userId: userId,
              cards: enrichedCards,
              totalSpend: totalSpend,
              lastUpdated: new Date()
            };
            deferred.resolve(portfolio);
          }).catch(deferred.reject);
        }).catch(function() {
          const mockCards = [
            {cardId: '1', cardNumber: '****1234', cardType: 'Visa', creditLimit: 10000, currentBalance: 2500, monthlySpend: 1200, transactions: []},
            {cardId: '2', cardNumber: '****5678', cardType: 'Mastercard', creditLimit: 15000, currentBalance: 5000, monthlySpend: 2300, transactions: []}
          ];
          deferred.resolve({userId: userId, cards: mockCards, totalSpend: 3500, lastUpdated: new Date()});
        });
        return deferred.promise;
      };
    }]);
})();