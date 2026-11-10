(function() {
  'use strict';
  angular.module('transactionModule').factory('CreditCardFactory', CreditCardFactory);
  CreditCardFactory.$inject = ['$http', 'API_ENDPOINTS'];
  function CreditCardFactory($http, API_ENDPOINTS) {
    return {
      getCardDetails: getCardDetails
    };
    function getCardDetails(cardIds) {
      return $http.get(API_ENDPOINTS.cards, {
        params: { ids: cardIds.join(',') }
      }).then(function(response) {
        return response.data;
      }).catch(function() {
        return [{
          cardId: '1',
          cardName: 'Visa Platinum',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa'
        }, {
          cardId: '2',
          cardName: 'Mastercard Gold',
          cardNumber: '**** **** **** 5678',
          cardType: 'Mastercard'
        }];
      });
    }
  }
})();