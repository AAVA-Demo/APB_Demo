(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .service('TransactionManagementService', ['$q', 'TransactionDataService', 'CreditCardService', function($q, TransactionDataService, CreditCardService) {
      this.getTransactions = function(userId, page, pageSize, filters) {
        return $q.all({
          transactions: TransactionDataService.fetchTransactions(userId, page, pageSize, filters),
          cards: CreditCardService.getCards(userId)
        }).then(function(results) {
          const transactions = results.transactions.transactions || [];
          const cards = results.cards || [];
          const cardMap = {};
          cards.forEach(function(card) {
            cardMap[card.cardId] = {
              cardName: card.cardName,
              cardLastFour: card.cardNumber
            };
          });
          const enrichedTransactions = transactions.map(function(txn) {
            const cardInfo = cardMap[txn.cardId] || { cardName: 'Unknown', cardLastFour: '****' };
            return angular.extend({}, txn, cardInfo);
          });
          return {
            transactions: enrichedTransactions,
            totalCount: results.transactions.totalCount,
            pageSize: results.transactions.pageSize,
            currentPage: results.transactions.currentPage,
            hasMore: results.transactions.hasMore
          };
        });
      };
      this.getTransactionById = function(transactionId) {
        return TransactionDataService.fetchTransactionDetail(transactionId);
      };
    }]);
})();