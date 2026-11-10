(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.getCategories = function() {
        return $http.get('/api/categories').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching categories:', error);
          return $q.reject(error);
        });
      };
      service.getMockCategories = function() {
        return $q.resolve(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
      };
    }]);
})();