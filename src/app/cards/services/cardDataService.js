(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .service('cardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var mockCards = [
        {cardId: 'c1', userId: 'user123', cardNumber: '4111111111111234', cardHolderName: 'John Doe', expiryDate: '12/25', cardType: 'Visa', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, issuerName: 'Chase', registeredDate: new Date()},
        {cardId: 'c2', userId: 'user123', cardNumber: '5500000000005678', cardHolderName: 'John Doe', expiryDate: '06/26', cardType: 'MasterCard', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, issuerName: 'Citi', registeredDate: new Date()},
        {cardId: 'c3', userId: 'user123', cardNumber: '340000000009012', cardHolderName: 'John Doe', expiryDate: '09/27', cardType: 'Amex', creditLimit: 20000, currentBalance: 8000, availableCredit: 12000, issuerName: 'Amex', registeredDate: new Date()}
      ];
      self.getCardsByUserId = function(userId) {
        return $q.resolve(mockCards.filter(function(c) { return c.userId === userId; }));
      };
      self.getCardById = function(cardId) {
        var card = mockCards.find(function(c) { return c.cardId === cardId; });
        return card ? $q.resolve(card) : $q.reject('Card not found');
      };
      self.createCard = function(cardData) {
        cardData.cardId = 'c' + (mockCards.length + 1);
        cardData.registeredDate = new Date();
        mockCards.push(cardData);
        return $q.resolve(cardData);
      };
    }]);
})();