(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionService', ['$http', '$q', function($http, $q) {
    function getMonthlySpend(userId, month) {
      var params = { userId: userId };
      if (month) {
        params.month = month;
      }
      return $http.get('/api/transactions/monthly-spend', { params: params })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching monthly spend:', error);
          return $q.reject(error);
        });
    }
    function getCardWiseSpending(cardId) {
      return $http.get('/api/transactions/card-wise', { params: { cardId: cardId } })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching card-wise spending:', error);
          return $q.reject(error);
        });
    }
    function getTransactionsByCategory(categoryId, userId) {
      return $http.get('/api/transactions', { params: { categoryId: categoryId, userId: userId } })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching transactions by category:', error);
          return $q.reject(error);
        });
    }
    return {
      getMonthlySpend: getMonthlySpend,
      getCardWiseSpending: getCardWiseSpending,
      getTransactionsByCategory: getTransactionsByCategory
    };
  }]);
})();