(function() {
  'use strict';
  angular.module('creditCardApp.kpi').service('TransactionService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
    var service = this;
    service.getMonthlySpend = function(userId) {
      return $http({
        method: 'GET',
        url: API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions + '/' + userId,
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Error fetching monthly spend:', error);
        throw error;
      });
    };
  }]);
  TransactionService.$inject = ['$http', 'API_CONFIG'];
})();