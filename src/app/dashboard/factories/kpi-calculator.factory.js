(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('KPICalculator', [function() {
      return {
        calculateKPIs: function(cards) {
          const totalCreditLimit = cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
          const totalAvailableCredit = cards.reduce((sum, card) => sum + (card.availableCredit || 0), 0);
          const totalOutstanding = cards.reduce((sum, card) => sum + (card.outstandingBalance || 0), 0);
          const monthlySpend = cards.reduce((sum, card) => sum + (card.currentMonthSpend || 0), 0);
          const availablePercentage = totalCreditLimit > 0 ? ((totalAvailableCredit / totalCreditLimit) * 100).toFixed(1) : 0;
          return {
            monthlySpend: {
              value: monthlySpend,
              currency: 'USD',
              trend: 'up'
            },
            totalCreditLimit: {
              value: totalCreditLimit,
              currency: 'USD'
            },
            availableCredit: {
              value: totalAvailableCredit,
              currency: 'USD',
              percentage: parseFloat(availablePercentage)
            },
            outstandingAmount: {
              value: totalOutstanding,
              currency: 'USD',
              dueDate: new Date(new Date().setDate(new Date().getDate() + 15))
            }
          };
        }
      };
    }]);
})();