(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserAuthFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        validateUser: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            deferred.resolve({data: {userId: 'U001', userName: 'John Doe', validated: true}});
          }, 200);
          return deferred.promise;
        }
      };
    }]);
})();