(function() {
  'use strict';
  angular.module('creditCardApp.kpi').service('CreditCardService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
    var service = this;
    service.getCardFinancials = function(userId) {
      return $http({
        method: 'GET',
        url: API_CONFIG.baseUrl + API_CONFIG.endpoints.cardFinancials + '/' + userId,
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Error fetching card financials:', error);
        throw error;
      });
    };
  }]);
  CreditCardService.$inject = ['$http', 'API_CONFIG'];
})();