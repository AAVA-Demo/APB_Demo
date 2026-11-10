(function() {
  'use strict';
  angular.module('creditCardApp.transaction')
    .factory('TransactionService', ['$http', '$q', 'API_BASE_URL', 'CardManagementService', TransactionService]);

  function TransactionService($http, $q, API_BASE_URL, CardManagementService) {
    return {
      getTransactions: getTransactions,
      getTransactionById: getTransactionById
    };

    function getTransactions(cardIds, page, size, filters) {
      var params = {
        cardIds: cardIds.join(','),
        page: page || 1,
        size: size || 50
      };
      if (filters) {
        angular.extend(params, filters);
      }
      return $http.get(API_BASE_URL + '/transactions', { params: params })
        .then(function(response) {
          return {
            transactions: response.data.transactions || [],
            pagination: response.data.pagination || {
              currentPage: page,
              pageSize: size,
              totalRecords: 0,
              totalPages: 0
            }
          };
        })
        .catch(function(error) {
          console.error('Error fetching transactions:', error);
          return $q.reject(error);
        });
    }

    function getTransactionById(id) {
      return $http.get(API_BASE_URL + '/transactions/' + id)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching transaction details:', error);
          return $q.reject(error);
        });
    }
  }
})();