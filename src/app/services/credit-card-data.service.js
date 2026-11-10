(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getCardBalances: getCardBalances
      };
      return service;
      function getCardBalances(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
    }]);
})();