(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategorizationService', ['$http', '$q', 'API_BASE_URL', CategorizationService]);

  function CategorizationService($http, $q, API_BASE_URL) {
    return {
      getCategorizedTransactions: getCategorizedTransactions
    };

    function getCategorizedTransactions(period) {
      var params = { period: period || '12months' };
      return $http.get(API_BASE_URL + '/analytics/spending', { params: params })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching categorized transactions:', error);
          return $q.reject(error);
        });
    }
  }
})();