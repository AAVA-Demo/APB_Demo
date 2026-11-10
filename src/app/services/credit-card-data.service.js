(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', CreditCardDataService]);
  function CreditCardDataService($http, $q, API_CONFIG) {
    var self = this;
    self.getAllCards = getAllCards;
    function getAllCards() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();