(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    return {
      fetchTransactions: function(filters) {
        const params = {};
        if (filters) {
          if (filters.startDate) params.startDate = filters.startDate;
          if (filters.endDate) params.endDate = filters.endDate;
          if (filters.cardIds) params.cardIds = filters.cardIds.join(',');
          if (filters.merchants) params.merchants = filters.merchants.join(',');
          if (filters.categories) params.categories = filters.categories.join(',');
          if (filters.minAmount) params.minAmount = filters.minAmount;
          if (filters.maxAmount) params.maxAmount = filters.maxAmount;
        }
        return $http.get(`${API_BASE}/transactions`, { params: params }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      },
      getTransactionById: function(transactionId) {
        return $http.get(`${API_BASE}/transactions/${transactionId}`).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      }
    };
  }]);
})();