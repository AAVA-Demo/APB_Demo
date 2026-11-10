(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = this;
      service.getAllCards = function() {
        var deferred = $q.defer();
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS, { timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching credit cards:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      service.getCardById = function(cardId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId, { timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching card details:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();