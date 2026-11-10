(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const self = this;
      self.fetchUserCards = function() {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return [
              {cardId: '1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 5000, currentBalance: 1200, availableBalance: 3800, dueDate: '2024-02-15', minPayment: 50},
              {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500, dueDate: '2024-02-20', minPayment: 75},
              {cardId: '3', cardNumber: '**** **** **** 9012', cardType: 'Amex', issuer: 'American Express', creditLimit: 10000, currentBalance: 3000, availableBalance: 7000, dueDate: '2024-02-25', minPayment: 100}
            ];
          });
      };
      self.getCardDetails = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId)
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            const mockCards = [
              {cardId: '1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 5000, currentBalance: 1200, availableBalance: 3800, dueDate: '2024-02-15', minPayment: 50},
              {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500, dueDate: '2024-02-20', minPayment: 75},
              {cardId: '3', cardNumber: '**** **** **** 9012', cardType: 'Amex', issuer: 'American Express', creditLimit: 10000, currentBalance: 3000, availableBalance: 7000, dueDate: '2024-02-25', minPayment: 100}
            ];
            return mockCards.find(c => c.cardId === cardId) || mockCards[0];
          });
      };
    }]);
})();