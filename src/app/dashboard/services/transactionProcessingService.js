(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .service('transactionProcessingService', ['$http', '$q', 'API_CONFIG', 'authService', function($http, $q, API_CONFIG, authService) {
      var self = this;
      self.getMonthlyTransactions = function() {
        return authService.getToken().then(function(token) {
          var now = new Date();
          var startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
            headers: {'Authorization': 'Bearer ' + token},
            params: {startDate: startDate.toISOString(), endDate: now.toISOString()}
          }).then(function(response) {
            return response.data || [
              {transactionId: 't1', cardId: 'c1', amount: 150, date: new Date(), merchantName: 'Restaurant', category: 'Food & Dining'},
              {transactionId: 't2', cardId: 'c2', amount: 80, date: new Date(), merchantName: 'Gas Station', category: 'Fuel'},
              {transactionId: 't3', cardId: 'c3', amount: 500, date: new Date(), merchantName: 'Online Store', category: 'Shopping'}
            ];
          });
        });
      };
    }]);
})();