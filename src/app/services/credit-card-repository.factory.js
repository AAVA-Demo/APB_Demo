(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardRepositoryFactory', ['$q', '$timeout', function($q, $timeout) {
      var mockCards = [
        {cardId: 'card1', cardNumber: '****1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500},
        {cardId: 'card2', cardNumber: '****5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 15000, currentBalance: 8000, availableCredit: 7000},
        {cardId: 'card3', cardNumber: '****9012', cardType: 'Amex', issuer: 'Amex', creditLimit: 20000, currentBalance: 5000, availableCredit: 15000}
      ];
      return {
        getUserCards: function(userId) {
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(angular.copy(mockCards));
          }, 100);
          return deferred.promise;
        },
        getCardById: function(cardId) {
          var deferred = $q.defer();
          $timeout(function() {
            var card = mockCards.find(function(c) { return c.cardId === cardId; });
            deferred.resolve(card ? angular.copy(card) : null);
          }, 50);
          return deferred.promise;
        }
      };
    }]);
})();