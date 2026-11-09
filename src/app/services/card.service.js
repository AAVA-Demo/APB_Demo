(function() {
  'use strict';
  angular.module('creditCardApp').service('CardService', ['$http', '$q', 'Card', function($http, $q, Card) {
    var cache = null;
    this.getAllCards = function() {
      if (cache) {
        return $q.resolve(cache);
      }
      return $http.get('/api/cards').then(function(response) {
        cache = response.data.map(function(cardData) {
          return new Card(cardData);
        });
        return cache;
      }).catch(function(error) {
        var mockCards = [
          {id: '1', cardNumber: '**** **** **** 1234', issuer: 'Chase', cardType: 'Visa', creditLimit: 10000, currentBalance: 3500, outstandingAmount: 3500, monthlySpend: 1200},
          {id: '2', cardNumber: '**** **** **** 5678', issuer: 'Citi', cardType: 'MasterCard', creditLimit: 15000, currentBalance: 5000, outstandingAmount: 5000, monthlySpend: 2100},
          {id: '3', cardNumber: '**** **** **** 9012', issuer: 'Amex', cardType: 'American Express', creditLimit: 20000, currentBalance: 8000, outstandingAmount: 8000, monthlySpend: 3200},
          {id: '4', cardNumber: '**** **** **** 3456', issuer: 'Discover', cardType: 'Discover', creditLimit: 8000, currentBalance: 2000, outstandingAmount: 2000, monthlySpend: 800}
        ];
        cache = mockCards.map(function(cardData) {
          return new Card(cardData);
        });
        return cache;
      });
    };
    this.clearCache = function() {
      cache = null;
    };
  }]);
})();