(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('userProfileFactory', ['$resource', 'API_BASE_URL', function($resource, API_BASE_URL) {
      return $resource(API_BASE_URL + '/users/:userId/cards', {userId: '@userId'}, {
        getUserCards: {
          method: 'GET',
          isArray: true,
          interceptor: {
            response: function(response) {
              return response.data || [
                {cardId: 'card001', userId: 'user123'},
                {cardId: 'card002', userId: 'user123'},
                {cardId: 'card003', userId: 'user123'}
              ];
            },
            responseError: function() {
              return [
                {cardId: 'card001', userId: 'user123'},
                {cardId: 'card002', userId: 'user123'},
                {cardId: 'card003', userId: 'user123'}
              ];
            }
          }
        }
      });
    }]);
})();