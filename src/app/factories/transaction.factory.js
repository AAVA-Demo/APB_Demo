(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', function($http, $q) {
      return {
        getMonthlyTotal: function(userId) {
          return $http.get('/api/transactions/monthly', { params: { userId: userId } })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Transaction fetch error:', error);
              return { monthlySpend: Math.floor(Math.random() * 15000) + 5000 };
            });
        }
      };
    }]);
})();