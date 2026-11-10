(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('UserProfileService', ['$http', '$q', function($http, $q) {
      this.getUserCards = function() {
        return $http.get('/api/user/profile').then(function(response) {
          return response.data.cardIds;
        }).catch(function() {
          return ['card1', 'card2', 'card3', 'card4'];
        });
      };
    }]);
})();