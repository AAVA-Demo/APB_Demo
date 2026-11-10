(function() {
  'use strict';
  angular.module('transactionModule').service('CreditCardService', CreditCardService);
  CreditCardService.$inject = ['$http', '$q', 'API_CONFIG'];
  function CreditCardService($http, $q, API_CONFIG) {
    var vm = this;
    vm.validateCardAccess = function(cardId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId + '/validate', { timeout: API_CONFIG.timeout })
        .then(function(response) {
          return response.data.hasAccess;
        });
    };
    vm.getCardMetadata = function(cardId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + cardId, { timeout: API_CONFIG.timeout })
        .then(function(response) {
          return response.data;
        });
    };
    vm.getAllCards = function() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards, { timeout: API_CONFIG.timeout })
        .then(function(response) {
          return response.data;
        });
    };
  }
})();