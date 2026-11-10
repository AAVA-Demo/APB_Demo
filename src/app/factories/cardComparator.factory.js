(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardComparatorFactory', [function() {
      return {
        rankCards: function(cards, spendingData) {
          var rankedCards = cards.map(function(card) {
            var spending = spendingData.find(function(s) { return s.cardId === card.cardId; }) || {};
            var utilization = card.creditLimit > 0 ? (card.outstandingAmount / card.creditLimit * 100).toFixed(2) : 0;
            return {
              cardId: card.cardId,
              cardNumber: card.cardNumber,
              issuer: card.issuer,
              monthlySpend: spending.monthlySpend || 0,
              utilization: parseFloat(utilization),
              availableCredit: card.availableCredit,
              creditLimit: card.creditLimit,
              outstandingAmount: card.outstandingAmount
            };
          });
          rankedCards.sort(function(a, b) {
            return b.monthlySpend - a.monthlySpend;
          });
          rankedCards.forEach(function(card, index) {
            card.rank = index + 1;
          });
          return rankedCards;
        },
        compareCards: function(selectedCards) {
          return selectedCards.map(function(card) {
            return {
              cardId: card.cardId,
              cardName: card.issuer + ' ' + card.cardNumber.slice(-4),
              monthlySpend: card.monthlySpend,
              utilization: card.utilization,
              availableCredit: card.availableCredit,
              creditLimit: card.creditLimit,
              outstandingAmount: card.outstandingAmount
            };
          });
        }
      };
    }]);
})();