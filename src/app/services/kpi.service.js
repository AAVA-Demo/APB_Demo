(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['$q', 'CreditCardService', 'CacheFactory', function($q, CreditCardService, CacheFactory) {
      var self = this;
      self.getKPIs = function(userId) {
        var cached = CacheFactory.get('kpi_' + userId);
        if (cached) {
          return $q.resolve(cached);
        }
        return CreditCardService.getAllCards(userId).then(function(cards) {
          var kpis = self.calculateKPIs(cards);
          kpis.userId = userId;
          kpis.lastUpdated = new Date();
          kpis.cards = cards;
          CacheFactory.put('kpi_' + userId, kpis);
          return kpis;
        });
      };
      self.calculateKPIs = function(cards) {
        var totalCreditLimit = 0;
        var availableCredit = 0;
        var outstandingAmount = 0;
        var monthlySpend = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          availableCredit += card.availableCredit || 0;
          outstandingAmount += card.balance || 0;
          monthlySpend += card.monthlySpend || 0;
        });
        return {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: outstandingAmount
        };
      };
    }]);
})();