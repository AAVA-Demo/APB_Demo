(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var factory = {};
      var cachedProfile = null;
      factory.getUserProfile = function() {
        if (cachedProfile) {
          return $q.resolve(cachedProfile);
        }
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
          .then(function(response) {
            cachedProfile = response.data || {
              userId: 'user123',
              name: 'John Doe',
              email: 'john.doe@example.com',
              cardIds: ['card1', 'card2', 'card3']
            };
            return cachedProfile;
          })
          .catch(function() {
            cachedProfile = {
              userId: 'user123',
              name: 'John Doe',
              email: 'john.doe@example.com',
              cardIds: ['card1', 'card2', 'card3']
            };
            return cachedProfile;
          });
      };
      return factory;
    }]);
})();