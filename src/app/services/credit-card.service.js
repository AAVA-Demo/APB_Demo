(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getAllCards = function(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + '/creditcards', {
          params: { userId: userId },
          timeout: API_CONFIG.timeout
        })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          console.error('Error fetching credit cards:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.getCardById = function(cardId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + '/creditcards/' + cardId, {
          timeout: API_CONFIG.timeout
        })
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