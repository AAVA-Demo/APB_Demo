(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileService', UserProfileService);
  UserProfileService.$inject = ['$http', '$q'];
  function UserProfileService($http, $q) {
    var service = {
      validateUser: validateUser
    };
    return service;
    function validateUser() {
      return $http.get('/api/users/validate')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();