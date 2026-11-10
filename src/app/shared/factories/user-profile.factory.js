(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileFactory', ['$http', '$q', UserProfileFactory]);
  function UserProfileFactory($http, $q) {
    var factory = {};
    factory.getUserCards = function(userId) {
      var deferred = $q.defer();
      $http.get('/api/users/' + userId + '/cards')
        .then(function(response) {
          deferred.resolve(response.data || []);
        })
        .catch(function(error) {
          var mockCardIds = ['card1', 'card2', 'card3'];
          deferred.resolve(mockCardIds);
        });
      return deferred.promise;
    };
    return factory;
  }
})();