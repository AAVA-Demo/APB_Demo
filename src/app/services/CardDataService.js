(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardDataService', ['ApiGatewayService', '$q', '$cacheFactory', function(ApiGatewayService, $q, $cacheFactory) {
      var cache = $cacheFactory('cardDataCache');
      var mockCards = [
        { cardId: 'card1', userId: 'user123', cardNumber: '**** **** **** 1234', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000, monthlySpend: 12000, cardHolderName: 'John Doe', expiryDate: '12/25', isActive: true },
        { cardId: 'card2', userId: 'user123', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', creditLimit: 30000, availableCredit: 20000, outstandingBalance: 10000, monthlySpend: 8000, cardHolderName: 'John Doe', expiryDate: '06/26', isActive: true },
        { cardId: 'card3', userId: 'user123', cardNumber: '**** **** **** 9012', cardType: 'Amex', creditLimit: 70000, availableCredit: 50000, outstandingBalance: 20000, monthlySpend: 15000, cardHolderName: 'John Doe', expiryDate: '03/27', isActive: true }
      ];
      return {
        getAllCards: function(userId) {
          var cached = cache.get('cards_' + userId);
          if (cached) return $q.resolve(cached);
          var deferred = $q.defer();
          setTimeout(function() {
            cache.put('cards_' + userId, mockCards);
            deferred.resolve(mockCards);
          }, 500);
          return deferred.promise;
        },
        getCardById: function(cardId) {
          var deferred = $q.defer();
          var card = mockCards.find(function(c) { return c.cardId === cardId; });
          setTimeout(function() {
            deferred.resolve(card);
          }, 300);
          return deferred.promise;
        }
      };
    }]);
})();