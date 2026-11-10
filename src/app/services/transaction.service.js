(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getMonthlySpend = function() {
        return $http.get(API_CONFIG.baseUrl + '/transactions/monthly-spend', { timeout: API_CONFIG.timeout })
          .then(function(response) {
            return response.data.amount || 0;
          })
          .catch(function() {
            return 28500;
          });
      };
    }]);
})();