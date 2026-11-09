(function() {
  'use strict';
  angular.module('creditCardApp').factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    return {
      getAllCards: function() {
        return $http.get(`${API_BASE}/cards`).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      },
      fetchCardById: function(cardId) {
        return $http.get(`${API_BASE}/cards/${cardId}`).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      },
      getCardSpendSummary: function(cardId) {
        return $http.get(`${API_BASE}/cards/${cardId}/spend`).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      }
    };
  }]);
})();