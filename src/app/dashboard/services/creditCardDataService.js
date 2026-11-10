(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .service('creditCardDataService', ['$http', '$q', 'API_CONFIG', 'authService', function($http, $q, API_CONFIG, authService) {
      var self = this;
      self.getAllCards = function() {
        return authService.getToken().then(function(token) {
          return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards, {
            headers: {'Authorization': 'Bearer ' + token}
          }).then(function(response) {
            return response.data || [
              {cardId: 'c1', cardNumber: '4111111111111234', cardType: 'Visa', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, issuerName: 'Chase'},
              {cardId: 'c2', cardNumber: '5500000000005678', cardType: 'MasterCard', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, issuerName: 'Citi'},
              {cardId: 'c3', cardNumber: '340000000009012', cardType: 'Amex', creditLimit: 20000, currentBalance: 8000, availableCredit: 12000, issuerName: 'Amex'}
            ];
          });
        });
      };
    }]);
})();