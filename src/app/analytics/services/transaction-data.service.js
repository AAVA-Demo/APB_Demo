(function() {
  'use strict';
  angular.module('app.analytics').service('TransactionDataService', ['$http', '$q', function($http, $q) {
    var API_BASE = '/api';
    this.getTransactions = function(months) {
      return $http.get(API_BASE + '/transactions', {
        params: { months: months || 12 }
      }).then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.error('Transaction fetch error:', err);
        return $q.reject(err);
      });
    };
  }]);
})();