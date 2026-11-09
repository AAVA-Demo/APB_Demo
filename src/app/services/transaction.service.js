(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var self = this;
      self.getSummary = function() {
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTION_SUMMARY)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transaction summary:', error);
            throw error;
          });
      };
    }]);
})();