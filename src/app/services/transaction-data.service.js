(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionDataService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var self = this;
      self.getTransactions = function(params) {
        var config = {
          params: params || {}
        };
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, config)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            throw error;
          });
      };
    }]);
})();