(function() {
  'use strict';
  angular.module('app.dashboard').service('TransactionSummaryService', ['$http', '$q', function($http, $q) {
    var API_BASE = '/api';
    this.getTransactionSummary = function() {
      return $http.get(API_BASE + '/transactions/summary').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.error('Transaction summary fetch error:', err);
        return $q.reject(err);
      });
    };
  }]);
})();