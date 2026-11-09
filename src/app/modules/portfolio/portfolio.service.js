(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .service('PortfolioService', ['CardDetailsService', 'TransactionService', 'UserProfileFactory', '$q', function(CardDetailsService, TransactionService, UserProfileFactory, $q) {
      this.getPortfolio = function() {
        var deferred = $q.defer();
        var userId = UserProfileFactory.getUserId();
        CardDetailsService.getCardsByUser(userId).then(function(cards) {
          var transactionPromises = cards.map(function(card) {
            return TransactionService.getTransactionsByCard(card.cardId);
          });
          return $q.all(transactionPromises).then(function(transactionsArrays) {
            var analysis = {};
            cards.forEach(function(card, index) {
              var transactions = transactionsArrays[index];
              var totalSpend = transactions.reduce(function(sum, txn) { return sum + txn.amount; }, 0);
              var currentMonth = new Date().getMonth();
              var currentYear = new Date().getFullYear();
              var monthlySpend = transactions.filter(function(txn) {
                var txnDate = new Date(txn.transactionDate);
                return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
              }).reduce(function(sum, txn) { return sum + txn.amount; }, 0);
              var utilizationPercent = card.creditLimit > 0 ? ((card.creditLimit - card.availableCredit) / card.creditLimit * 100) : 0;
              analysis[card.cardId] = {
                cardId: card.cardId,
                totalSpend: totalSpend,
                monthlySpend: monthlySpend,
                utilizationPercent: utilizationPercent.toFixed(2),
                transactionCount: transactions.length,
                transactions: transactions
              };
            });
            deferred.resolve({ cards: cards, analysis: analysis });
          });
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();