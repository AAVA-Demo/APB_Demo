(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', TransactionService);
  TransactionService.$inject = ['TransactionDataFactory', 'CreditCardFactory', '$q', '$cacheFactory'];
  function TransactionService(TransactionDataFactory, CreditCardFactory, $q, $cacheFactory) {
    var vm = this;
    var cache = $cacheFactory('transactionCache');
    vm.getTransactions = getTransactions;
    vm.getTransactionDetail = getTransactionDetail;
    function getTransactions(pageNumber, pageSize) {
      var cacheKey = 'transactions_' + pageNumber + '_' + pageSize;
      var cachedData = cache.get(cacheKey);
      if (cachedData) {
        return $q.resolve(cachedData);
      }
      return TransactionDataFactory.fetchTransactions(pageNumber, pageSize).then(function(response) {
        var cardIds = response.transactions.map(function(t) { return t.cardId; }).filter(function(v, i, a) { return a.indexOf(v) === i; });
        return CreditCardFactory.getCardDetails(cardIds).then(function(cards) {
          var cardMap = {};
          cards.forEach(function(card) {
            cardMap[card.cardId] = card;
          });
          response.transactions.forEach(function(transaction) {
            var card = cardMap[transaction.cardId];
            if (card) {
              transaction.cardName = card.cardName;
            }
          });
          cache.put(cacheKey, response);
          return response;
        });
      });
    }
    function getTransactionDetail(transactionId) {
      return TransactionDataFactory.fetchTransactionById(transactionId);
    }
  }
})();