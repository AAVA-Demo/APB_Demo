(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPIService', ['CreditCardFactory', 'TransactionFactory', '$q', KPIService]);
  function KPIService(CreditCardFactory, TransactionFactory, $q) {
    var service = this;
    service.getAggregatedKPIs = function(userId) {
      var deferred = $q.defer();
      $q.all({
        cards: CreditCardFactory.getAllCards(userId),
        transactions: TransactionFactory.getMonthlyTransactions(userId)
      }).then(function(results) {
        var cards = results.cards;
        var transactions = results.transactions;
        var totalCreditLimit = 0;
        var availableCredit = 0;
        var outstandingAmount = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          availableCredit += card.availableCredit || 0;
          outstandingAmount += card.outstandingBalance || 0;
        });
        var monthlySpend = 0;
        var categorySpend = {};
        transactions.forEach(function(txn) {
          monthlySpend += txn.amount || 0;
          var cat = txn.category || 'Miscellaneous';
          categorySpend[cat] = (categorySpend[cat] || 0) + txn.amount;
        });
        var topCategory = 'N/A';
        var maxSpend = 0;
        for (var cat in categorySpend) {
          if (categorySpend[cat] > maxSpend) {
            maxSpend = categorySpend[cat];
            topCategory = cat;
          }
        }
        var kpiData = {
          userId: userId,
          lastUpdated: new Date(),
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: outstandingAmount,
          cardCount: cards.length,
          topSpendingCategory: topCategory
        };
        deferred.resolve(kpiData);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }
})();