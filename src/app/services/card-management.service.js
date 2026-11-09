(function() {
  'use strict';
  angular.module('creditCardApp').service('CardManagementService', ['CardDataService', 'TransactionService', '$q', function(CardDataService, TransactionService, $q) {
    this.getCardPortfolio = function() {
      return CardDataService.getAllCards().then(cards => {
        const spendingPromises = cards.map(card => TransactionService.getCardSpending(card.cardId));
        return $q.all(spendingPromises).then(spendingData => {
          const enrichedCards = cards.map((card, index) => {
            return Object.assign({}, card, { spendAnalysis: spendingData[index] });
          });
          const totalCreditLimit = enrichedCards.reduce((sum, c) => sum + (c.creditLimit || 0), 0);
          const totalAvailableCredit = enrichedCards.reduce((sum, c) => sum + (c.availableCredit || 0), 0);
          const totalOutstanding = enrichedCards.reduce((sum, c) => sum + (c.currentBalance || 0), 0);
          return {
            cards: enrichedCards,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            cardCount: enrichedCards.length
          };
        });
      });
    };
    this.getCardDetail = function(cardId) {
      return CardDataService.getCardById(cardId).then(card => {
        return TransactionService.getCardSpending(cardId).then(spending => {
          return Object.assign({}, card, { spendAnalysis: spending });
        });
      });
    };
  }]);
})();