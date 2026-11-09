(function() {
  'use strict';
  angular.module('cardManagement.module')
    .service('CardService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      let cardCache = null;
      this.getCards = function() {
        if (cardCache) {
          return $q.resolve(cardCache);
        }
        const mockCards = [
          {
            cardId: 'card_001',
            cardNumber: '**** **** **** 1234',
            cardHolderName: 'John Doe',
            creditLimit: 10000.00,
            currentBalance: 2345.67,
            availableCredit: 7654.33,
            cardType: 'Visa',
            expiryDate: '12/25'
          },
          {
            cardId: 'card_002',
            cardNumber: '**** **** **** 5678',
            cardHolderName: 'John Doe',
            creditLimit: 15000.00,
            currentBalance: 3900.00,
            availableCredit: 11100.00,
            cardType: 'Mastercard',
            expiryDate: '06/26'
          },
          {
            cardId: 'card_003',
            cardNumber: '**** **** **** 9012',
            cardHolderName: 'John Doe',
            creditLimit: 5000.00,
            currentBalance: 0.00,
            availableCredit: 5000.00,
            cardType: 'Amex',
            expiryDate: '03/27'
          }
        ];
        cardCache = mockCards;
        return $q.resolve(mockCards);
      };
      this.getCardById = function(cardId) {
        return this.getCards().then(function(cards) {
          const card = cards.find(function(c) { return c.cardId === cardId; });
          return card ? $q.resolve(card) : $q.reject('Card not found');
        });
      };
      this.clearCache = function() {
        cardCache = null;
      };
    }]);
})();