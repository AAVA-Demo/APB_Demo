(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$q', '$timeout', function($q, $timeout) {
      var cache = null;
      var cacheTime = null;
      var TTL = 300000;
      var mockCards = [
        {cardId: 'card1', cardNumber: '****1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500},
        {cardId: 'card2', cardNumber: '****5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 15000, currentBalance: 8000, availableCredit: 7000},
        {cardId: 'card3', cardNumber: '****9012', cardType: 'Amex', issuer: 'Amex', creditLimit: 20000, currentBalance: 5000, availableCredit: 15000}
      ];
      return {
        getAllCards: function() {
          var deferred = $q.defer();
          if (cache && cacheTime && (Date.now() - cacheTime < TTL)) {
            deferred.resolve(angular.copy(cache));
          } else {
            $timeout(function() {
              cache = mockCards;
              cacheTime = Date.now();
              deferred.resolve(angular.copy(mockCards));
            }, 100);
          }
          return deferred.promise;
        }
      };
    }]);
})();