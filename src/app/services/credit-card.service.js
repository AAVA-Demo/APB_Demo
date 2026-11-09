(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      this.getUserCards = function() {
        return $http.get(API_ENDPOINTS.cards).then(function(response) {
          return response.data;
        });
      };
      this.validateCardOwnership = function(cardId) {
        return $http.get(API_ENDPOINTS.cards + '/' + cardId + '/validate').then(function(response) {
          return response.data.isOwner;
        });
      };
    }]);
})();