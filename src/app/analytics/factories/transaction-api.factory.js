(function() {
  'use strict';
  angular.module('app.analytics').factory('TransactionAPIFactory', ['$http', '$q', function($http, $q) {
    var baseUrl = '/api/transactions';
    return {
      getTransactions: function(userId, dateRange) {
        var params = {userId: userId};
        if (dateRange) {
          if (dateRange.start) params.startDate = dateRange.start;
          if (dateRange.end) params.endDate = dateRange.end;
        }
        return $http.get(baseUrl, {params: params}).then(function(response) {
          return response.data;
        }).catch(function(err) {
          return $q.reject(err);
        });
      }
    };
  }]);
})();