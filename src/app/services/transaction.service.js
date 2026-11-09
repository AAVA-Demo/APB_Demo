(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
      var service = {
        getMonthlyTransactions: getMonthlyTransactions,
        getTransactionsByCard: getTransactionsByCard,
        getTransactions: getTransactions
      };
      return service;

      function getMonthlyTransactions() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        return $http.get($rootScope.apiBaseUrl + '/api/transactions', {
          params: { month: year + '-' + month }
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
      }

      function getTransactionsByCard(cardId) {
        return $http.get($rootScope.apiBaseUrl + '/api/transactions', {
          params: { cardId: cardId }
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
      }

      function getTransactions(startDate, endDate) {
        return $http.get($rootScope.apiBaseUrl + '/api/transactions', {
          params: {
            startDate: startDate,
            endDate: endDate
          }
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
      }
    }]);
})();