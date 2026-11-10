(function() {
  'use strict';
  angular.module('dashboardModule').factory('CreditCardDataFactory', CreditCardDataFactory);
  CreditCardDataFactory.$inject = ['$http', 'API_ENDPOINTS'];
  function CreditCardDataFactory($http, API_ENDPOINTS) {
    return {
      fetchAllCards: fetchAllCards
    };
    function fetchAllCards() {
      return $http.get(API_ENDPOINTS.cards).then(function(response) {
        return response.data;
      }).catch(function() {
        return [{
          cardId: '1',
          cardName: 'Visa Platinum',
          cardNumber: '**** **** **** 1234',
          creditLimit: 50000,
          outstandingAmount: 15000,
          availableCredit: 35000,
          monthlySpend: 8500,
          cardType: 'Visa'
        }, {
          cardId: '2',
          cardName: 'Mastercard Gold',
          cardNumber: '**** **** **** 5678',
          creditLimit: 30000,
          outstandingAmount: 8000,
          availableCredit: 22000,
          monthlySpend: 5200,
          cardType: 'Mastercard'
        }];
      });
    }
  }
})();