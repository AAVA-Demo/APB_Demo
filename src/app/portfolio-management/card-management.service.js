(function() {
  'use strict';
  angular.module('portfolioManagementModule')
    .factory('CardManagementService', ['$http', '$q', 'DataStorageFactory', 'TransactionService', function($http, $q, DataStorageFactory, TransactionService) {
      var mockCards = [
        { cardId: 'card-001', userId: 'user-001', cardNumber: '************1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 10000, availableCredit: 7500, currentBalance: 2500, utilizationPercentage: 25, status: 'Active' },
        { cardId: 'card-002', userId: 'user-001', cardNumber: '************5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 15000, availableCredit: 12000, currentBalance: 3000, utilizationPercentage: 20, status: 'Active' },
        { cardId: 'card-003', userId: 'user-001', cardNumber: '************9012', cardType: 'Amex', issuer: 'American Express', creditLimit: 20000, availableCredit: 18000, currentBalance: 2000, utilizationPercentage: 10, status: 'Active' }
      ];
      return {
        getCards: function() {
          var cached = DataStorageFactory.getCachedData('cards');
          if (cached) {
            return $q.resolve(cached);
          }
          return $q.resolve(mockCards).then(function(cards) {
            DataStorageFactory.cacheData('cards', cards);
            return cards;
          });
        }
      };
    }]);
})();