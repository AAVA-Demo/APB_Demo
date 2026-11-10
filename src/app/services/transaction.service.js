(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', TransactionService]);
  function TransactionService($http, $q, API_CONFIG) {
    var self = this;
    self.getCurrentMonthTransactions = getCurrentMonthTransactions;
    function getCurrentMonthTransactions() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: {month: currentMonth}
      })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
    }
  }
})();