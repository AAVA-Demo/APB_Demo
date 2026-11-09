(function() {
  'use strict';
  angular.module('app.dashboard').service('KPIService', ['CreditCardAPIFactory', 'TransactionAPIFactory', 'CacheService', '$q', function(CreditCardAPIFactory, TransactionAPIFactory, CacheService, $q) {
    var self = this;
    self.loadDashboardData = function(userId) {
      var cacheKey = 'dashboardKPI_' + userId;
      var cached = CacheService.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $q.all({
        cards: CreditCardAPIFactory.getCards(userId),
        summary: TransactionAPIFactory.getMonthlySummary(userId)
      }).then(function(results) {
        var cards = results.cards;
        var summary = results.summary;
        var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
        var availableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
        var dashboardKPI = {
          userId: userId,
          timestamp: new Date(),
          monthlySpend: parseFloat(summary.monthlySpend).toFixed(2),
          totalCreditLimit: parseFloat(totalCreditLimit).toFixed(2),
          availableCredit: parseFloat(availableCredit).toFixed(2),
          outstandingAmount: parseFloat(summary.outstandingAmount).toFixed(2),
          cards: cards.map(function(card) {
            return {
              cardId: card.cardId,
              cardName: card.cardName,
              cardNumber: card.cardNumber,
              creditLimit: parseFloat(card.creditLimit).toFixed(2),
              availableCredit: parseFloat(card.availableCredit).toFixed(2),
              outstandingAmount: parseFloat(card.currentBalance).toFixed(2),
              monthlySpend: parseFloat(card.monthlySpend || 0).toFixed(2)
            };
          })
        };
        CacheService.put(cacheKey, dashboardKPI);
        return dashboardKPI;
      });
    };
    self.clearCache = function(userId) {
      CacheService.remove('dashboardKPI_' + userId);
    };
  }]);
})();