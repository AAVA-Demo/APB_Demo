(function() {
  'use strict';
  angular.module('analyticsModule').service('TransactionDataService', TransactionDataService);
  TransactionDataService.$inject = ['$http', '$q', 'API_CONFIG'];
  function TransactionDataService($http, $q, API_CONFIG) {
    var vm = this;
    vm.getRawTransactions = function(filter) {
      var params = {};
      if (filter) {
        if (filter.cardIds) params.cardIds = filter.cardIds.join(',');
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/raw', { params: params, timeout: API_CONFIG.timeout })
        .then(function(response) {
          return response.data;
        });
    };
  }
})();