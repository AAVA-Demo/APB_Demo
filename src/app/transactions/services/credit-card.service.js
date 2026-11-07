(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .service('CreditCardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getCards = function(userId) {
        return $http({
          method: 'GET',
          url: API_CONFIG.baseUrl + '/creditcards',
          params: { userId: userId },
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          return response.data.cards || [];
        }).catch(function(error) {
          console.error('Error fetching credit cards:', error);
          return $q.resolve([
            { cardId: 'card-001', cardName: 'Visa Platinum', cardNumber: '****1234' },
            { cardId: 'card-002', cardName: 'Mastercard Gold', cardNumber: '****5678' }
          ]);
        });
      };
    }]);
})();