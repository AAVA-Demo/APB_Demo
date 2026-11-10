(function() {
  'use strict';
  angular.module('creditCardApp').service('balanceService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getOutstandingBalances = function() {
      return $http.get('/api/balances').then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getBalanceByCard = function(cardId) {
      return $http.get('/api/balances/' + cardId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();