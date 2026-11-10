(function() {
  'use strict';
  angular.module('creditCardApp').factory('UserProfileService', ['$http', '$q', function($http, $q) {
    function getUserCards(userId) {
      return $http.get('/api/users/' + userId + '/cards')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching user cards:', error);
          return $q.reject(error);
        });
    }
    return {
      getUserCards: getUserCards
    };
  }]);
})();