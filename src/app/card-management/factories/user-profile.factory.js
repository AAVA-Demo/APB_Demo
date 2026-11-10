(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('UserProfileFactory', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      return {
        getCardsByUserId: function(userId) {
          return $http.get(API_ENDPOINTS.userProfile + '/' + userId + '/cards')
            .then(function(response) {
              return response.data.cardIds;
            })
            .catch(function() {
              return ['card-001', 'card-002', 'card-003'];
            });
        }
      };
    }]);
})();