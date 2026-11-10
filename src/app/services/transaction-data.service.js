(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionDataService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
    var cache = $cacheFactory('transactionCache');
    var API_BASE = '/api/transactions';
    this.getHistoricalTransactions = function() {
      var cached = cache.get('historicalTransactions');
      if (cached) { return $q.resolve(cached); }
      return $http.get(API_BASE + '/history').then(function(response) {
        cache.put('historicalTransactions', response.data);
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();