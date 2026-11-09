(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardService', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    this.getAllCards = function() {
      return $http.get(`${API_BASE}/cards`).then(response => response.data).catch(err => {
        console.error('Error fetching cards:', err);
        return $q.reject(err);
      });
    };
    this.getCardById = function(cardId) {
      return $http.get(`${API_BASE}/cards/${cardId}`).then(response => response.data).catch(err => {
        console.error('Error fetching card:', err);
        return $q.reject(err);
      });
    };
  }]);
})();