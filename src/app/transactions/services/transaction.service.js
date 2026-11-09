(function() {
  'use strict';
  angular.module('transactionModule')
    .service('TransactionService', ['$http', '$q', TransactionService]);

  function TransactionService($http, $q) {
    var service = {
      getTransactions: getTransactions
    };
    return service;

    function getTransactions(filterCriteria) {
      var deferred = $q.defer();
      var params = {
        startDate: filterCriteria.startDate ? filterCriteria.startDate.toISOString() : null,
        endDate: filterCriteria.endDate ? filterCriteria.endDate.toISOString() : null,
        cardId: filterCriteria.cardId || null,
        category: filterCriteria.category || null,
        page: filterCriteria.pageNumber || 1,
        pageSize: filterCriteria.pageSize || 50
      };

      $http.get('/api/transactions', { params: params })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      
      return deferred.promise;
    }
  }
})();