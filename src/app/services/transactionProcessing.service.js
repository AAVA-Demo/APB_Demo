(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionProcessingService', ['$http', '$q', 'API_CONFIG', TransactionProcessingService]);
  function TransactionProcessingService($http, $q, API_CONFIG) {
    var vm = this;
    vm.getMonthlyData = function() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.getTransactions = function(params) {
      var config = {
        params: params || {categorized: true}
      };
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, config)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.getCardTransactions = function(cardId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: {cardId: cardId, categorized: true}
      })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
  }
})();