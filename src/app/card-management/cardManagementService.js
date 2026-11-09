(function() {
  'use strict';
  angular.module('creditCardApp').service('cardManagementService', ['$http', '$q', 'authFactory', function($http, $q, authFactory) {
    this.getAllCards = function() {
      var userId = authFactory.getUserId();
      return $http.get('/api/cards', { params: { userId: userId } }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $http.get('src/app/card-management/mock-cards.json').then(function(mockResponse) {
          return mockResponse.data;
        });
      });
    };
    this.getCardById = function(cardId) {
      return $http.get('/api/cards/' + cardId).then(function(response) {
        return response.data;
      });
    };
  }]);
})();