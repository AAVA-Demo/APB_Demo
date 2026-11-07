(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getAllCards = function(userId) {
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
            {
              cardId: 'card-001',
              cardName: 'Visa Platinum',
              cardNumber: '****1234',
              creditLimit: 50000,
              availableCredit: 35000,
              outstandingBalance: 15000,
              currentMonthSpend: 12000
            },
            {
              cardId: 'card-002',
              cardName: 'Mastercard Gold',
              cardNumber: '****5678',
              creditLimit: 30000,
              availableCredit: 22000,
              outstandingBalance: 8000,
              currentMonthSpend: 6500
            }
          ]);
        });
      };
    }]);
})();