(function() {
  'use strict';
  angular.module('dashboardModule').factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
    var factory = {};
    factory.getSummary = function() {
      return $http.get('/api/cards/summary').then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
    return factory;
  }]);
})();