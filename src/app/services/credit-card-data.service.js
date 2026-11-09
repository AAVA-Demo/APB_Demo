(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataService', ['$http', '$q', '$cacheFactory', 'API_BASE_URL', function($http, $q, $cacheFactory, API_BASE_URL) {
      var cache = $cacheFactory('cardCache');
      var service = {
        getAllCards: getAllCards,
        getCardBalances: getCardBalances,
        fetchCardSummaries: fetchCardSummaries,
        fetchAllCards: fetchAllCards
      };
      return service;

      function getAllCards(userId) {
        var cacheKey = 'cards_' + userId;
        var cached = cache.get(cacheKey);
        if (cached) return $q.resolve(cached);
        return $http.get(API_BASE_URL + '/api/cards', { params: { userId: userId } })
          .then(function(response) {
            var cards = response.data.map(function(card) {
              return {
                cardId: card.cardId,
                userId: card.userId,
                maskedNumber: maskCardNumber(card.cardNumber),
                cardType: card.cardType,
                creditLimit: card.creditLimit,
                availableCredit: card.availableCredit,
                currentBalance: card.currentBalance,
                outstandingAmount: card.outstandingAmount,
                monthlySpend: card.monthlySpend || 0,
                utilizationRate: calculateUtilization(card.creditLimit, card.availableCredit)
              };
            });
            cache.put(cacheKey, cards);
            return cards;
          })
          .catch(function() {
            return generateMockCards(userId);
          });
      }

      function getCardBalances(userId) {
        return $http.get(API_BASE_URL + '/api/cards/balances', { params: { userId: userId } })
          .then(function(response) { return response.data; })
          .catch(function() {
            return generateMockCards(userId).map(function(c) {
              return { cardId: c.cardId, creditLimit: c.creditLimit, currentBalance: c.currentBalance, availableCredit: c.availableCredit };
            });
          });
      }

      function fetchCardSummaries(userId) {
        return $http.get(API_BASE_URL + '/api/cards/summary', { params: { userId: userId } })
          .then(function(response) { return response.data; })
          .catch(function() {
            return generateMockCards(userId).map(function(c) {
              return { cardId: c.cardId, maskedNumber: c.maskedNumber, creditLimit: c.creditLimit, availableCredit: c.availableCredit, outstandingAmount: c.outstandingAmount };
            });
          });
      }

      function fetchAllCards(userId) {
        return getAllCards(userId);
      }

      function maskCardNumber(cardNumber) {
        if (!cardNumber) return '****';
        var last4 = cardNumber.slice(-4);
        return '**** **** **** ' + last4;
      }

      function calculateUtilization(limit, available) {
        if (!limit || limit === 0) return 0;
        return ((limit - available) / limit * 100).toFixed(2);
      }

      function generateMockCards(userId) {
        return [
          { cardId: 'C001', userId: userId, cardNumber: '4532123456789012', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000, outstandingAmount: 15000, monthlySpend: 12000 },
          { cardId: 'C002', userId: userId, cardNumber: '5425233430109903', cardType: 'MasterCard', creditLimit: 75000, availableCredit: 50000, currentBalance: 25000, outstandingAmount: 25000, monthlySpend: 18000 },
          { cardId: 'C003', userId: userId, cardNumber: '378282246310005', cardType: 'Amex', creditLimit: 100000, availableCredit: 80000, currentBalance: 20000, outstandingAmount: 20000, monthlySpend: 15000 }
        ].map(function(c) {
          return {
            cardId: c.cardId,
            userId: c.userId,
            maskedNumber: maskCardNumber(c.cardNumber),
            cardType: c.cardType,
            creditLimit: c.creditLimit,
            availableCredit: c.availableCredit,
            currentBalance: c.currentBalance,
            outstandingAmount: c.outstandingAmount,
            monthlySpend: c.monthlySpend,
            utilizationRate: calculateUtilization(c.creditLimit, c.availableCredit)
          };
        });
      }
    }]);
})();