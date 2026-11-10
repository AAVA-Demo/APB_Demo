(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('UserProfileService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        getUserProfile: function() {
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USER_PROFILE, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateUserProfile: function(profileData) {
          return $http.put(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USER_PROFILE, profileData, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();