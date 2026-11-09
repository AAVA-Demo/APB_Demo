(function() {
  'use strict';
  angular.module('creditCardApp').service('KpiService', ['CreditCardService', 'TransactionService', '$q', function(CreditCardService, TransactionService, $q) {
    this.getConsolidatedKpis = function() {
      return $q.all({
        cards: CreditCardService.getAllCards(),
        monthlySpend: TransactionService.getMonthlySpend()
      }).then(results => {
        const cards = results.cards || [];
        const monthlySpend = results.monthlySpend || { totalSpend: 0 };
        const totalCreditLimit = cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
        const totalOutstanding = cards.reduce((sum, card) => sum + (card.currentBalance || 0), 0);
        const availableCredit = totalCreditLimit - totalOutstanding;
        const utilizationPercentage = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(2) : 0;
        return {
          monthlySpend: monthlySpend.totalSpend || 0,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: totalOutstanding,
          utilizationPercentage: utilizationPercentage,
          lastUpdated: new Date()
        };
      });
    };
  }]);
})();