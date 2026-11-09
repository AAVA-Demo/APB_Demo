(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', CreditCardDataFactory]);
  function CreditCardDataFactory($http, $q) {
    var factory = {
      fetchAllCards: fetchAllCards
    };
    return factory;
    function fetchAllCards() {
      var mockData = [
        {
          cardId: 'CC001',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa Platinum',
          creditLimit: 100000,
          availableCredit: 65000,
          outstandingAmount: 35000,
          monthlySpend: 28000,
          lastUpdated: new Date()
        },
        {
          cardId: 'CC002',
          cardNumber: '**** **** **** 5678',
          cardType: 'MasterCard Gold',
          creditLimit: 75000,
          availableCredit: 50000,
          outstandingAmount: 25000,
          monthlySpend: 18000,
          lastUpdated: new Date()
        },
        {
          cardId: 'CC003',
          cardNumber: '**** **** **** 9012',
          cardType: 'Amex Blue',
          creditLimit: 150000,
          availableCredit: 120000,
          outstandingAmount: 30000,
          monthlySpend: 22000,
          lastUpdated: new Date()
        }
      ];
      return $q.resolve(mockData);
    }
  }
})();