(function() {
  'use strict';
  angular.module('creditCardApp').service('creditCardService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getCards = function() {
      return $http.get('/api/creditcards').then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getCardById = function(cardId) {
      return $http.get('/api/creditcards/' + cardId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();