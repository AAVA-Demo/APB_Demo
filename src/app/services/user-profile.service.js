(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('UserProfileService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.validateUser = function(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + '/user/validate', {
          params: { userId: userId },
          timeout: API_CONFIG.timeout
        })
        .then(function(response) {
          deferred.resolve(response.data.valid);
        })
        .catch(function(error) {
          console.error('User validation error:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.getCurrentUser = function() {
        return { userId: 'user123' };
      };
    }]);
})();