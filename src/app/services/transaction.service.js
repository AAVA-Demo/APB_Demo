(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    this.getMonthlySpend = function() {
      return $http.get(`${API_BASE}/transactions/monthly`).then(response => response.data).catch(err => {
        console.error('Error fetching monthly spend:', err);
        return $q.reject(err);
      });
    };
    this.getCardSpending = function(cardId) {
      return $http.get(`${API_BASE}/transactions/card/${cardId}`).then(response => response.data).catch(err => {
        console.error('Error fetching card spending:', err);
        return $q.reject(err);
      });
    };
    this.fetchTransactions = function(startDate, endDate) {
      return $http.get(`${API_BASE}/transactions`, { params: { start: startDate, end: endDate } }).then(response => response.data).catch(err => {
        console.error('Error fetching transactions:', err);
        return $q.reject(err);
      });
    };
  }]);
})();