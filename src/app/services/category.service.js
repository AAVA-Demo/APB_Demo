(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var self = this;
      var cachedCategories = null;
      self.getCategories = function() {
        if (cachedCategories) {
          return Promise.resolve(cachedCategories);
        }
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .then(function(response) {
            cachedCategories = response.data;
            return cachedCategories;
          })
          .catch(function(error) {
            console.error('Error fetching categories:', error);
            cachedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
            return cachedCategories;
          });
      };
    }]);
})();