(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getTransactions = function(userId, startDate, endDate) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + '/transactions', {
          params: {
            userId: userId,
            startDate: startDate,
            endDate: endDate
          },
          timeout: API_CONFIG.timeout
        })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          console.error('Error fetching transactions:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();