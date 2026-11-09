(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', CreditCardDataService]);
  function CreditCardDataService($http, $q, API_CONFIG) {
    var vm = this;
    vm.getAllCards = function() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.getCardsByUser = function(userId) {
      var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.userCards.replace(':userId', userId);
      return $http.get(url)
        .then(function(response) {
          return response.data.map(function(card) {
            card.availableCredit = card.creditLimit - card.outstandingAmount;
            return card;
          });
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.getCardById = function(cardId) {
      var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardDetails.replace(':cardId', cardId);
      return $http.get(url)
        .then(function(response) {
          var card = response.data;
          card.availableCredit = card.creditLimit - card.outstandingAmount;
          return card;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
  }
})();