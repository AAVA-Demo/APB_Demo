(function() {
  'use strict';
  angular.module('creditCardApp.portfolio').service('BalanceService', ['$http', 'CardDataFactory', 'API_CONFIG', function($http, CardDataFactory, API_CONFIG) {
    var service = this;
    service.getBalances = function(userId) {
      return CardDataFactory.get(API_CONFIG.endpoints.balances + '/' + userId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Error fetching balances:', error);
        throw error;
      });
    };
  }]);
  BalanceService.$inject = ['$http', 'CardDataFactory', 'API_CONFIG'];
})();