(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AnalyticsEngineService', ['$q', 'TransactionCategorizationService', 'TransactionService', 'CreditCardService', function($q, TransactionCategorizationService, TransactionService, CreditCardService) {
      this.getSpendingAnalytics = function(filters) {
        return $q.all({
          categorizedTransactions: TransactionCategorizationService.getCategorizedTransactions(),
          transactions: TransactionService.getAllTransactions(),
          cards: CreditCardService.getAllCards()
        }).then(function(results) {
          const categorizedTxns = results.categorizedTransactions;
          const cards = results.cards;
          
          const categoryMap = {};
          const monthMap = {};
          const cardMap = {};
          
          categorizedTxns.forEach(txn => {
            if (!categoryMap[txn.category]) {
              categoryMap[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
            }
            categoryMap[txn.category].totalSpend += txn.amount;
            categoryMap[txn.category].transactionCount++;
            
            const monthKey = new Date(txn.transactionDate).toISOString().substring(0, 7);
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = { month: monthKey, totalSpend: 0 };
            }
            monthMap[monthKey].totalSpend += txn.amount;
            
            if (!cardMap[txn.cardId]) {
              const card = cards.find(c => c.cardId === txn.cardId);
              cardMap[txn.cardId] = { cardId: txn.cardId, cardName: card ? card.cardName : 'Unknown', totalSpend: 0 };
            }
            cardMap[txn.cardId].totalSpend += txn.amount;
          });
          
          return {
            categoryData: Object.values(categoryMap),
            monthlyData: Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)),
            cardData: Object.values(cardMap)
          };
        });
      };
    }]);
})();