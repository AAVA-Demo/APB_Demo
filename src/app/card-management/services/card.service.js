(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardService', ['$http', '$q', '$cacheFactory', 'API_CONFIG', function($http, $q, $cacheFactory, API_CONFIG) {
      var self = this;
      var cardCache = $cacheFactory('cardCache');
      self.getAllCards = function(cardIds) {
        var cacheKey = 'allCards';
        var cached = cardCache.get(cacheKey);
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
          .then(function(response) {
            var cards = response.data.cards || [];
            cardCache.put(cacheKey, cards);
            return cards;
          })
          .catch(function() {
            var mockCards = [
              {
                cardId: 'card1',
                cardNumber: '4111111111111111',
                maskedCardNumber: '**** **** **** 1111',
                cardType: 'Visa',
                issuer: 'HDFC Bank',
                expiryDate: '12/2025',
                creditLimit: 50000,
                availableCredit: 35000,
                outstandingAmount: 15000,
                currentMonthSpend: 15000
              },
              {
                cardId: 'card2',
                cardNumber: '5500000000000004',
                maskedCardNumber: '**** **** **** 0004',
                cardType: 'Mastercard',
                issuer: 'ICICI Bank',
                expiryDate: '06/2026',
                creditLimit: 30000,
                availableCredit: 20000,
                outstandingAmount: 10000,
                currentMonthSpend: 10000
              },
              {
                cardId: 'card3',
                cardNumber: '340000000000009',
                maskedCardNumber: '**** ****** *0009',
                cardType: 'Amex',
                issuer: 'American Express',
                expiryDate: '09/2024',
                creditLimit: 20000,
                availableCredit: 15000,
                outstandingAmount: 5000,
                currentMonthSpend: 5000
              }
            ];
            cardCache.put(cacheKey, mockCards);
            return mockCards;
          });
      };
      self.getCardDetails = function(cardId) {
        var cacheKey = 'card_' + cardId;
        var cached = cardCache.get(cacheKey);
        if (cached) {
          return $q.resolve(cached);
        }
        return self.getAllCards().then(function(cards) {
          var card = cards.find(function(c) { return c.cardId === cardId; });
          if (card) {
            var cardWithMetrics = angular.extend({}, card, {
              utilizationRate: card.creditLimit > 0 ? ((card.outstandingAmount / card.creditLimit) * 100).toFixed(2) : 0,
              recentTransactions: [
                { date: new Date(), merchant: 'Amazon', amount: 2500, category: 'Shopping' },
                { date: new Date(), merchant: 'Starbucks', amount: 350, category: 'Food & Dining' },
                { date: new Date(), merchant: 'Shell', amount: 1200, category: 'Fuel' }
              ]
            });
            cardCache.put(cacheKey, cardWithMetrics);
            return cardWithMetrics;
          }
          return $q.reject('Card not found');
        });
      };
    }]);
})();