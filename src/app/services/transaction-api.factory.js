(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionAPI', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const baseUrl = API_CONFIG.baseUrl;

      return {
        getTransactionSummary: function(userId) {
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.transactionsSummary}?userId=${userId}`)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Transaction summary API error:', error);
              return $q.reject(error);
            });
        },
        fetchTransactions: function(userId, timeRange) {
          const params = {
            userId: userId,
            startDate: timeRange.startDate.toISOString(),
            endDate: timeRange.endDate.toISOString()
          };
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.transactions}`, {params: params})
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Fetch transactions API error:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();