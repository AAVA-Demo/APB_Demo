(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardAuthService', ['$q', function($q) {
      return {
        validateCardOwnership: function(cardIds) {
          var deferred = $q.defer();
          setTimeout(function() {
            deferred.resolve({ valid: true, cardIds: cardIds });
          }, 200);
          return deferred.promise;
        }
      };
    }]);
})();