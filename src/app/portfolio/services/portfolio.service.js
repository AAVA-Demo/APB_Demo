(function() {
  'use strict';
  angular.module('portfolio')
    .service('PortfolioService', ['$q', 'CreditCardDataService', 'CreditCalculationFactory', function($q, CreditCardDataService, CreditCalculationFactory) {
      this.getPortfolioSummary = function() {
        return CreditCardDataService.fetchAllCards()
          .then(function(cards) {
            const enrichedCards = cards.map(function(card) {
              card.availableCredit = CreditCalculationFactory.calculateAvailableCredit(card);
              return card;
            });
            const summary = {
              totalCards: enrichedCards.length,
              totalCreditLimit: enrichedCards.reduce((sum, c) => sum + c.totalCreditLimit, 0),
              totalOutstanding: enrichedCards.reduce((sum, c) => sum + c.outstandingAmount, 0),
              totalAvailableCredit: enrichedCards.reduce((sum, c) => sum + c.availableCredit, 0),
              totalMonthlySpend: enrichedCards.reduce((sum, c) => sum + c.monthlySpend, 0),
              cards: enrichedCards
            };
            return summary;
          });
      };
    }]);
})();