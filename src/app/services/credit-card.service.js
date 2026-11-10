(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .factory('CreditCardService', ['$http', '$q', 'AuthService', 'CreditCardFactory', function($http, $q, AuthService, CreditCardFactory) {
      var cache = null;
      var cacheTime = null;
      var CACHE_DURATION = 30000;
      function getAllCards() {
        if (cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
          return $q.resolve(cache);
        }
        var mockData = [
          {
            cardId: 'card001',
            cardNumber: '**** **** **** 1234',
            cardType: 'Visa',
            cardHolderName: 'John Doe',
            creditLimit: 10000,
            outstandingAmount: 2500,
            monthlySpend: 1200,
            expiryDate: '12/25'
          },
          {
            cardId: 'card002',
            cardNumber: '**** **** **** 5678',
            cardType: 'MasterCard',
            cardHolderName: 'John Doe',
            creditLimit: 15000,
            outstandingAmount: 4000,
            monthlySpend: 1800,
            expiryDate: '06/26'
          },
          {
            cardId: 'card003',
            cardNumber: '**** **** **** 9012',
            cardType: 'Amex',
            cardHolderName: 'John Doe',
            creditLimit: 20000,
            outstandingAmount: 5500,
            monthlySpend: 2300,
            expiryDate: '03/27'
          }
        ];
        var cards = mockData.map(function(data) {
          return CreditCardFactory.create(data);
        });
        cache = cards;
        cacheTime = Date.now();
        return $q.resolve(cards);
      }
      return {
        getAllCards: getAllCards
      };
    }]);
})();