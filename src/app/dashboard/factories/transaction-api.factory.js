(function() {
  'use strict';
  angular.module('app.dashboard').factory('TransactionAPIFactory', ['$http', '$q', function($http, $q) {
    var baseUrl = '/api/transactions';
    return {
      getMonthlySummary: function(userId) {
        return $http.get(baseUrl + '/summary?userId=' + userId).then(function(response) {
          return response.data;
        }).catch(function(err) {
          return $q.reject(err);
        });
      }
    };
  }]);
})();