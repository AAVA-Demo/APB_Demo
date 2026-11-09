(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var self = this;
      var cachedCards = null;
      self.getCards = function() {
        if (cachedCards) {
          return Promise.resolve(cachedCards);
        }
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
          .then(function(response) {
            cachedCards = response.data;
            return cachedCards;
          })
          .catch(function(error) {
            console.error('Error fetching credit cards:', error);
            throw error;
          });
      };
      self.clearCache = function() {
        cachedCards = null;
      };
    }]);
})();