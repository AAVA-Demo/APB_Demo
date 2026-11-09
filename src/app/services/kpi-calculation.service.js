(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPICalculationService', [function() {
      this.calculateKPIs = function(cardData) {
        const monthlySpend = cardData.reduce((sum, c) => sum + c.currentMonthSpend, 0);
        const totalCreditLimit = cardData.reduce((sum, c) => sum + c.creditLimit, 0);
        const outstandingAmount = cardData.reduce((sum, c) => sum + c.balance, 0);
        const availableCredit = cardData.reduce((sum, c) => sum + (c.creditLimit - c.balance), 0);
        return {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: outstandingAmount,
          lastUpdated: new Date()
        };
      };
    }]);
})();