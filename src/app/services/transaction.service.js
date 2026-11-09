(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
    this.getMonthlyTransactions = function() {
      var now = new Date();
      var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      var params = '?from=' + startOfMonth.toISOString() + '&to=' + now.toISOString();
      return $http.get(API_ENDPOINTS.TRANSACTIONS + params).then(function(response) {
        return response.data;
      });
    };
    this.getTransactions = function(filters, page) {
      filters = filters || {};
      page = page || 1;
      var params = '?page=' + page + '&limit=20';
      if (filters.cardId) params += '&cardId=' + filters.cardId;
      if (filters.startDate) params += '&from=' + filters.startDate;
      if (filters.endDate) params += '&to=' + filters.endDate;
      if (filters.category) params += '&category=' + filters.category;
      return $http.get(API_ENDPOINTS.TRANSACTIONS + params).then(function(response) {
        return response.data;
      });
    };
    this.getTransactionById = function(transactionId) {
      return $http.get(API_ENDPOINTS.TRANSACTIONS + '/' + transactionId).then(function(response) {
        return response.data;
      });
    };
    this.getTransactionsByDateRange = function(startDate, endDate) {
      var params = '?from=' + startDate + '&to=' + endDate;
      return $http.get(API_ENDPOINTS.TRANSACTIONS + params).then(function(response) {
        return response.data;
      });
    };
  }]);
})();