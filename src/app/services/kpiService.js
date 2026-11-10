(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPIService', ['$q', 'CreditCardService', 'TransactionService', function($q, CreditCardService, TransactionService) {
    function getKPIData(userId) {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var promises = {
        cardData: CreditCardService.getCardBalances(userId),
        spendData: TransactionService.getMonthlySpend(userId, currentMonth)
      };
      return $q.all(promises)
        .then(function(results) {
          var cardData = results.cardData;
          var spendData = results.spendData;
          var totalCreditLimit = 0;
          var availableCredit = 0;
          var outstandingAmount = 0;
          if (cardData && cardData.cards) {
            cardData.cards.forEach(function(card) {
              totalCreditLimit += card.creditLimit || 0;
              availableCredit += card.availableCredit || 0;
              outstandingAmount += card.outstandingBalance || 0;
            });
          }
          var monthlySpend = spendData && spendData.totalSpend ? spendData.totalSpend : 0;
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            lastUpdated: new Date()
          };
        })
        .catch(function(error) {
          console.error('Error aggregating KPI data:', error);
          return $q.reject(error);
        });
    }
    return {
      getKPIData: getKPIData
    };
  }]);
})();