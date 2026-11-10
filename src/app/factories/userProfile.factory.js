(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileFactory', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      return {
        getUserCards: function(userId) {
          return ApiGatewayService.get('/user/profile/cards?userId=' + userId)
            .catch(function(error) {
              return {
                userId: userId,
                associatedCards: ['card-1', 'card-2', 'card-3'],
                selectedCardId: 'card-1'
              };
            });
        }
      };
    }]);
})();