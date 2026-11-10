(function() {
  'use strict';
  angular.module('creditCardApp').service('transactionDataService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getTransactions = function(startDate, endDate) {
      return $http.get('/api/transactions', {
        params: { start: startDate, end: endDate }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getTransactionById = function(transactionId) {
      return $http.get('/api/transactions/' + transactionId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();