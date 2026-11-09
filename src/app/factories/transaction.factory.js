(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var factory = {
        getMonthlySpend: getMonthlySpend,
        getCardTransactions: getCardTransactions,
        getTransactions: getTransactions
      };
      return factory;
      function getMonthlySpend() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        var params = {
          startDate: firstDay.toISOString(),
          endDate: today.toISOString()
        };
        return $http.get(API_CONFIG.baseUrl + '/transactions/monthly', { params: params })
          .then(function(response) {
            return response.data.totalSpend || 0;
          })
          .catch(function(error) {
            console.error('Error fetching monthly spend:', error);
            return $q.reject(error);
          });
      }
      function getCardTransactions(cardId) {
        return $http.get(API_CONFIG.baseUrl + '/transactions', { params: { cardId: cardId } })
          .then(function(response) {
            return response.data.map(function(txn) {
              return {
                transactionId: txn.id,
                amount: txn.amount,
                merchant: txn.merchant,
                date: txn.date,
                category: txn.category
              };
            });
          })
          .catch(function(error) {
            console.error('Error fetching card transactions:', error);
            return $q.reject(error);
          });
      }
      function getTransactions(startDate, endDate) {
        var params = {
          start: startDate ? startDate.toISOString() : null,
          end: endDate ? endDate.toISOString() : null
        };
        return $http.get(API_CONFIG.baseUrl + '/transactions', { params: params })
          .then(function(response) {
            return response.data.map(function(txn) {
              return {
                transactionId: txn.id,
                amount: txn.amount,
                merchant: txn.merchant,
                date: txn.date,
                category: txn.category
              };
            });
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
      }
    }]);
})();