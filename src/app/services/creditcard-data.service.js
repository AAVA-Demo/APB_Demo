(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('CreditCardDataService', ['$http', '$q', function($http, $q) {
      var userId = 'current';
      this.fetchAllCards = function() {
        return $http.get('/api/users/' + userId + '/cards').then(function(response) {
          return response.data || [];
        }).catch(function(error) {
          console.error('Failed to fetch cards:', error);
          return $q.reject(error);
        });
      };
      this.fetchTransactions = function(params) {
        return $http.get('/api/transactions', {params: params}).then(function(response) {
          return response.data || [];
        }).catch(function(error) {
          console.error('Failed to fetch transactions:', error);
          return $q.reject(error);
        });
      };
    }]);
})();