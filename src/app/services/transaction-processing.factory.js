(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionProcessingFactory', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    return {
      getMonthlySpend: function() {
        return $http.get(`${API_BASE}/transactions/monthly-spend`).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      }
    };
  }]);
})();