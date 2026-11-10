(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardFactory', ['$http', '$cacheFactory', '$q', CreditCardFactory]);
  function CreditCardFactory($http, $cacheFactory, $q) {
    var cache = $cacheFactory('creditCardCache');
    var factory = {};
    factory.getAllCards = function(userId) {
      var cacheKey = 'cards_' + userId;
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      var deferred = $q.defer();
      $http.get('/api/cards', { params: { userId: userId } })
        .then(function(response) {
          var cards = response.data || [];
          cache.put(cacheKey, cards);
          setTimeout(function() { cache.remove(cacheKey); }, 120000);
          deferred.resolve(cards);
        })
        .catch(function(error) {
          var mockCards = [
            { cardId: 'card1', cardNumber: '1234567812345678', cardType: 'Visa', creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500, dueDate: new Date('2024-02-15') },
            { cardId: 'card2', cardNumber: '8765432187654321', cardType: 'MasterCard', creditLimit: 15000, availableCredit: 12000, outstandingBalance: 3000, dueDate: new Date('2024-02-20') },
            { cardId: 'card3', cardNumber: '1111222233334444', cardType: 'Amex', creditLimit: 20000, availableCredit: 18000, outstandingBalance: 2000, dueDate: new Date('2024-02-25') }
          ];
          deferred.resolve(mockCards);
        });
      return deferred.promise;
    };
    return factory;
  }
})();