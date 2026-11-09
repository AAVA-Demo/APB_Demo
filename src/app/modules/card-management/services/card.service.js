(function() {
  'use strict';
  angular.module('creditCard.management')
    .service('CardService', ['$http', '$q', 'API_CONFIG', '$cacheFactory', CardService]);
  function CardService($http, $q, API_CONFIG, $cacheFactory) {
    const cache = $cacheFactory('cardCache');
    const service = {
      fetchUserCards: fetchUserCards,
      getCardById: getCardById,
      addCard: addCard
    };
    return service;
    function fetchUserCards() {
      const cacheKey = 'userCards';
      const cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
        .then(function(response) {
          const cards = response.data || generateMockCards();
          cache.put(cacheKey, cards);
          return cards;
        })
        .catch(function() {
          return generateMockCards();
        });
    }
    function getCardById(cardId) {
      return fetchUserCards()
        .then(function(cards) {
          const card = cards.find(function(c) { return c.id === cardId; });
          return card || $q.reject('Card not found');
        });
    }
    function addCard(cardData) {
      return $http.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards, cardData)
        .then(function(response) {
          cache.remove('userCards');
          return response.data;
        });
    }
    function generateMockCards() {
      return [
        {
          id: 'card1',
          userId: 'user1',
          cardNumber: '1234',
          cardHolderName: 'John Doe',
          bankName: 'HDFC Bank',
          cardType: 'Visa',
          creditLimit: 50000,
          availableCredit: 32000,
          outstandingBalance: 18000,
          monthlySpend: 8700,
          expiryDate: '12/25',
          isActive: true
        },
        {
          id: 'card2',
          userId: 'user1',
          cardNumber: '5678',
          cardHolderName: 'John Doe',
          bankName: 'ICICI Bank',
          cardType: 'MasterCard',
          creditLimit: 75000,
          availableCredit: 54500,
          outstandingBalance: 20500,
          monthlySpend: 20500,
          expiryDate: '06/26',
          isActive: true
        },
        {
          id: 'card3',
          userId: 'user1',
          cardNumber: '9012',
          cardHolderName: 'John Doe',
          bankName: 'SBI Card',
          cardType: 'Visa',
          creditLimit: 25000,
          availableCredit: 8500,
          outstandingBalance: 16500,
          monthlySpend: 25800,
          expiryDate: '03/27',
          isActive: true
        }
      ];
    }
  }
})();