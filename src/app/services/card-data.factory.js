(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .factory('cardDataFactory', ['$http', '$q', cardDataFactory]);

  function cardDataFactory($http, $q) {
    return {
      getCards: function() {
        var deferred = $q.defer();
        var mockCards = [
          {
            cardId: 'card-001',
            cardNumber: '**** **** **** 1234',
            cardType: 'Visa',
            creditLimit: 10000,
            outstandingAmount: 2500,
            availableCredit: 7500
          },
          {
            cardId: 'card-002',
            cardNumber: '**** **** **** 5678',
            cardType: 'MasterCard',
            creditLimit: 15000,
            outstandingAmount: 5000,
            availableCredit: 10000
          },
          {
            cardId: 'card-003',
            cardNumber: '**** **** **** 9012',
            cardType: 'Amex',
            creditLimit: 20000,
            outstandingAmount: 8000,
            availableCredit: 12000
          }
        ];
        setTimeout(function() {
          deferred.resolve(mockCards);
        }, 500);
        return deferred.promise;
      }
    };
  }
})();