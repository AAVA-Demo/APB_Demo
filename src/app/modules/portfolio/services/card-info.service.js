(function() {
  'use strict';
  angular.module('creditCardApp.portfolio').service('CardInfoService', ['$http', 'CardDataFactory', 'API_CONFIG', function($http, CardDataFactory, API_CONFIG) {
    var service = this;
    service.getCardInfo = function(userId) {
      return CardDataFactory.get(API_CONFIG.endpoints.cards + '/' + userId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Error fetching card info:', error);
        throw error;
      });
    };
  }]);
  CardInfoService.$inject = ['$http', 'CardDataFactory', 'API_CONFIG'];
})();