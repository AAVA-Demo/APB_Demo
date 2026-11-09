(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardService', ['$http', '$cacheFactory', function($http, $cacheFactory) {
      const cache = $cacheFactory('creditCardCache');
      const API_BASE = '/api/creditcards';
      this.getCards = function() {
        const cachedData = cache.get('cards');
        if (cachedData) {
          return Promise.resolve(cachedData);
        }
        return $http.get(API_BASE).then(function(response) {
          cache.put('cards', response.data);
          return response.data;
        });
      };
      this.clearCache = function() {
        cache.removeAll();
      };
    }]);
})();