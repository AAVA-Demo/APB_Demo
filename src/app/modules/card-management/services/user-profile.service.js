(function() {
  'use strict';
  angular.module('creditCard.management')
    .service('UserProfileService', ['$http', '$q', 'API_CONFIG', UserProfileService]);
  function UserProfileService($http, $q, API_CONFIG) {
    const service = {
      validateUser: validateUser,
      getUserProfile: getUserProfile
    };
    return service;
    function validateUser() {
      return $q.resolve({ valid: true, userId: 'user1' });
    }
    function getUserProfile() {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
        .then(function(response) {
          return response.data;
        })
        .catch(function() {
          return { userId: 'user1', name: 'John Doe', email: 'john@example.com' };
        });
    }
  }
})();