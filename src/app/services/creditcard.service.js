(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const self = this;
      self.fetchCards = function() {
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return [
              {cardId: '1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 5000, currentBalance: 1200, availableBalance: 3800},
              {cardId: '2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 8000, currentBalance: 2500, availableBalance: 5500},
              {cardId: '3', cardNumber: '**** **** **** 9012', cardType: 'Amex', issuer: 'American Express', creditLimit: 10000, currentBalance: 3000, availableBalance: 7000}
            ];
          });
      };
    }]);
})();