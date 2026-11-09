(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('CreditCardDataService', ['$http', '$q', 'UserService', function($http, $q, UserService) {
      var mockCards = [
        { cardId: 'card-001', userId: 'user-001', cardType: 'Visa', creditLimit: 10000, availableCredit: 7500, currentBalance: 2500 },
        { cardId: 'card-002', userId: 'user-001', cardType: 'MasterCard', creditLimit: 15000, availableCredit: 12000, currentBalance: 3000 },
        { cardId: 'card-003', userId: 'user-001', cardType: 'Amex', creditLimit: 20000, availableCredit: 18000, currentBalance: 2000 }
      ];
      return {
        getCards: function() {
          return $q.resolve(mockCards);
        }
      };
    }]);
})();