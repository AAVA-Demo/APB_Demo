(function() {
  'use strict';
  angular.module('creditCardApp.portfolio').service('PortfolioService', ['CardInfoService', 'BalanceService', '$q', function(CardInfoService, BalanceService, $q) {
    var service = this;
    service.getPortfolio = function(userId) {
      var promises = {
        cardInfo: CardInfoService.getCardInfo(userId),
        balances: BalanceService.getBalances(userId)
      };
      return $q.all(promises).then(function(results) {
        var cardInfo = results.cardInfo;
        var balances = results.balances;
        var cards = cardInfo.map(function(card, index) {
          var balance = balances[index] || {};
          return {
            cardId: card.cardId,
            cardNumber: card.cardNumber,
            cardType: card.cardType,
            cardholderName: card.cardholderName,
            creditLimit: card.creditLimit,
            availableCredit: balance.availableCredit || 0,
            outstandingBalance: balance.outstandingBalance || 0,
            status: card.status
          };
        });
        var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
        var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
        var totalOutstanding = cards.reduce(function(sum, card) { return sum + card.outstandingBalance; }, 0);
        return {
          userId: userId,
          cards: cards,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          lastUpdated: new Date()
        };
      }).catch(function(error) {
        console.error('Error building portfolio:', error);
        throw error;
      });
    };
  }]);
  PortfolioService.$inject = ['CardInfoService', 'BalanceService', '$q'];
})();