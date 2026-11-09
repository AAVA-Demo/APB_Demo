(function() {
  'use strict';
  angular.module('app.transactions').factory('TransactionAPIFactory', ['$http', '$q', function($http, $q) {
    var baseUrl = '/api/transactions';
    return {
      getTransactions: function(userId, filter) {
        var params = {userId: userId};
        if (filter) {
          if (filter.cardId) params.cardId = filter.cardId;
          if (filter.startDate) params.startDate = filter.startDate;
          if (filter.endDate) params.endDate = filter.endDate;
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