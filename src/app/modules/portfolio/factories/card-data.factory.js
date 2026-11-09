(function() {
  'use strict';
  angular.module('creditCardApp.portfolio').factory('CardDataFactory', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
    var factory = {};
    factory.get = function(endpoint, params) {
      return $http({
        method: 'GET',
        url: API_CONFIG.baseUrl + endpoint,
        params: params,
        timeout: API_CONFIG.timeout
      });
    };
    return factory;
  }]);
  CardDataFactory.$inject = ['$http', 'API_CONFIG'];
})();