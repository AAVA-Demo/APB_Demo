(function() {
  'use strict';
  angular.module('creditCardManagementModule').factory('CardDataFactory', ['$http', '$q', function($http, $q) {
    var factory = {};
    factory.fetchCards = function() {
      return $http.get('/api/cards').then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
    return factory;
  }]);
})();