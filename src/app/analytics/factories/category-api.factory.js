(function() {
  'use strict';
  angular.module('app.analytics').factory('CategoryAPIFactory', ['$http', '$q', function($http, $q) {
    var baseUrl = '/api/categories';
    return {
      getCategories: function() {
        return $http.get(baseUrl).then(function(response) {
          return response.data;
        }).catch(function(err) {
          return $q.reject(err);
        });
      }
    };
  }]);
})();