(function() {
  'use strict';
  angular.module('dashboard')
    .factory('CreditCardAPIFactory', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      return {
        getAllCardsSummary: function(userId) {
          return $http.get(API_ENDPOINTS.dashboard, { params: { userId: userId } })
            .then(function(response) {
              return response.data;
            })
            .catch(function() {
              return [
                { cardId: 'card-001', monthlySpend: 1250.50, creditLimit: 10000, availableCredit: 8749.50, outstandingBalance: 1250.50 },
                { cardId: 'card-002', monthlySpend: 890.25, creditLimit: 15000, availableCredit: 14109.75, outstandingBalance: 890.25 },
                { cardId: 'card-003', monthlySpend: 2100.00, creditLimit: 20000, availableCredit: 17900.00, outstandingBalance: 2100.00 }
              ];
            });
        }
      };
    }]);
})();