(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .factory('UserProfileFactory', ['$http', 'LocalStorageService', function($http, LocalStorageService) {
      var factory = {};
      factory.getUserId = function() {
        return LocalStorageService.get('userId') || 'user123';
      };
      factory.getCardUserMapping = function() {
        return {
          userId: this.getUserId(),
          cards: ['card1', 'card2', 'card3', 'card4', 'card5']
        };
      };
      return factory;
    }]);
})();