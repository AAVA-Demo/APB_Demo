(function() {
  'use strict';
  angular.module('transactionModule')
    .factory('TransactionService', ['$http', '$q', 'CreditCardService', function($http, $q, CreditCardService) {
      return {
        getTransactions: function(page, limit, filters) {
          const params = {
            page: page,
            limit: limit
          };
          if (filters.searchTerm) params.search = filters.searchTerm;
          if (filters.cardId) params.cardId = filters.cardId;
          if (filters.dateFrom) params.dateFrom = filters.dateFrom;
          if (filters.dateTo) params.dateTo = filters.dateTo;
          if (filters.category) params.category = filters.category;
          
          return $q.all({
            transactions: $http.get('/api/transactions', { params: params }),
            cards: CreditCardService.getCardDetails()
          }).then(function(results) {
            const transactions = results.transactions.data.transactions || [];
            const cards = results.cards;
            const cardMap = {};
            cards.forEach(card => cardMap[card.cardId] = card);
            
            transactions.forEach(txn => {
              if (cardMap[txn.cardId]) {
                txn.cardName = cardMap[txn.cardId].cardName;
              }
            });
            
            return {
              transactions: transactions,
              totalCount: results.transactions.data.totalCount || transactions.length
            };
          }).catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
        },
        getTransactionById: function(transactionId) {
          return $http.get('/api/transactions/' + transactionId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Error fetching transaction detail:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();