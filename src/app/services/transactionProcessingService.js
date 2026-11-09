(function() {
  'use strict';
  angular.module('creditCardApp').service('transactionProcessingService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
    this.getMonthlyTransactions = function() {
      const deferred = $q.defer();
      const url = apiConfig.baseUrl + apiConfig.endpoints.monthlyTransactions;
      $http.get(url, {timeout: apiConfig.timeout}).then(function(response) {
        deferred.resolve(response.data);
      }, function(error) {
        console.error('Error fetching monthly transactions:', error);
        deferred.resolve(getMockMonthlyData());
      });
      return deferred.promise;
    };
    function getMockMonthlyData() {
      return {
        monthlySpend: 4500,
        outstandingAmount: 4500
      };
    }
  }]);
})();