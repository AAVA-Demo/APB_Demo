(function() {
  'use strict';
  angular.module('dashboardModule').service('CreditCardDataService', CreditCardDataService);
  CreditCardDataService.$inject = ['$http', '$q', 'API_CONFIG'];
  function CreditCardDataService($http, $q, API_CONFIG) {
    var vm = this;
    vm.getCardDetails = function(cardId) {
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