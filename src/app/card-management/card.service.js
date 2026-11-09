(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardService', ['$http', 'ApiService', '$q', function($http, ApiService, $q) {
      var portfolioCache = null;
      this.getCardPortfolio = function() {
        if (portfolioCache) {
          return $q.resolve(portfolioCache);
        }
        return ApiService.get('/cards/portfolio').then(function(response) {
          portfolioCache = response.data;
          return portfolioCache;
        }).catch(function(error) {
          console.error('Failed to fetch card portfolio:', error);
          return $q.reject(error);
        });
      };
      this.getCardDetails = function(cardId) {
        return ApiService.get('/cards/' + cardId + '/details').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Failed to fetch card details:', error);
          return $q.reject(error);
        });
      };
      this.clearCache = function() {
        portfolioCache = null;
      };
    }]);
  CardService.$inject = ['$http', 'ApiService', '$q'];
})();