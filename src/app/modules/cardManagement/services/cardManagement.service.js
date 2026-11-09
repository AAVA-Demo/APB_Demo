(function() {
  'use strict';
  angular.module('creditCardManagement')
    .service('CardManagementService', ['$q', 'CreditCardDataService', 'UserAuthService', 'TransactionProcessingService', CardManagementService]);
  function CardManagementService($q, CreditCardDataService, UserAuthService, TransactionProcessingService) {
    var vm = this;
    var cardCache = null;
    vm.getAllUserCards = function() {
      if (cardCache) {
        return $q.resolve(cardCache);
      }
      var userId = UserAuthService.getUserId();
      return CreditCardDataService.getCardsByUser(userId)
        .then(function(cards) {
          cardCache = cards;
          return cards;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.getCardDetails = function(cardId) {
      var promises = {
        card: CreditCardDataService.getCardById(cardId),
        transactions: TransactionProcessingService.getCardTransactions(cardId)
      };
      return $q.all(promises)
        .then(function(results) {
          var spendAnalysis = vm._calculateSpendAnalysis(results.transactions);
          return {
            card: results.card,
            spendAnalysis: spendAnalysis
          };
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm._calculateSpendAnalysis = function(transactions) {
      var categoryBreakdown = {};
      var monthlySpend = 0;
      var transactionCount = transactions.length;
      transactions.forEach(function(txn) {
        monthlySpend += txn.amount;
        if (!categoryBreakdown[txn.category]) {
          categoryBreakdown[txn.category] = 0;
        }
        categoryBreakdown[txn.category] += txn.amount;
      });
      var categoryArray = Object.keys(categoryBreakdown).map(function(category) {
        return {
          category: category,
          amount: parseFloat(categoryBreakdown[category].toFixed(2))
        };
      });
      return {
        monthlySpend: parseFloat(monthlySpend.toFixed(2)),
        categoryBreakdown: categoryArray,
        transactionCount: transactionCount
      };
    };
    vm.clearCache = function() {
      cardCache = null;
    };
  }
})();