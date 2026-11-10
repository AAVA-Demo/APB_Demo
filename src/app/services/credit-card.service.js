(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('CreditCardService', ['$http', '$q', 'AuthService', '$cacheFactory', function($http, $q, AuthService, $cacheFactory) {
      var cache = $cacheFactory('creditCardCache');
      var service = {
        getCards: getCards
      };
      return service;
      function getCards() {
        var cached = cache.get('cards');
        if (cached) {
          return $q.resolve(cached);
        }
        return $http({
          method: 'GET',
          url: '/api/cards',
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          var cards = response.data.map(function(card) {
            card.availableCredit = card.creditLimit - card.outstandingAmount;
            return card;
          });
          cache.put('cards', cards);
          setTimeout(function() { cache.remove('cards'); }, 120000);
          return cards;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            var mockCards = [
              {cardId: 'c1', cardNumber: '**** **** **** 1234', cardType: 'Visa Platinum', creditLimit: 50000, outstandingAmount: 12000, availableCredit: 38000, lastUpdated: new Date()},
              {cardId: 'c2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard Gold', creditLimit: 30000, outstandingAmount: 8000, availableCredit: 22000, lastUpdated: new Date()},
              {cardId: 'c3', cardNumber: '**** **** **** 9012', cardType: 'Amex Blue', creditLimit: 20000, outstandingAmount: 5000, availableCredit: 15000, lastUpdated: new Date()}
            ];
            return mockCards;
          }
          return $q.reject(error);
        });
      }
    }]);
})();