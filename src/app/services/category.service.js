(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('CategoryService', ['$http', '$q', function($http, $q) {
      var service = {
        getCategories: getCategories
      };
      return service;
      function getCategories() {
        return $http({
          method: 'GET',
          url: '/api/categories'
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            return [
              {name: 'Food & Dining', color: '#FF6384'},
              {name: 'Fuel', color: '#36A2EB'},
              {name: 'Shopping', color: '#FFCE56'},
              {name: 'Travel', color: '#4BC0C0'},
              {name: 'Entertainment', color: '#9966FF'},
              {name: 'Utilities', color: '#FF9F40'},
              {name: 'Healthcare', color: '#FF6384'},
              {name: 'Education', color: '#C9CBCF'},
              {name: 'Miscellaneous', color: '#4BC0C0'}
            ];
          }
          return $q.reject(error);
        });
      }
    }]);
})();