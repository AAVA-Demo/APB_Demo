(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('authFactory', ['$window', '$q', function($window, $q) {
      var factory = {};
      factory.validateAuth = function() {
        var deferred = $q.defer();
        var token = $window.sessionStorage.getItem('authToken');
        if (token) {
          deferred.resolve(token);
        } else {
          var mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIn0.mock';
          $window.sessionStorage.setItem('authToken', mockToken);
          deferred.resolve(mockToken);
        }
        return deferred.promise;
      };
      factory.getToken = function() {
        return $window.sessionStorage.getItem('authToken');
      };
      factory.getUserId = function() {
        return 'user123';
      };
      return factory;
    }]);
})();