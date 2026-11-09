(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryAnalyticsService', ['$http', function($http) {
      const API_BASE = '/api/analytics/categories';
      this.getCategorySpending = function(params) {
        return $http.get(API_BASE, { params: params }).then(function(response) {
          return response.data;
        });
      };
    }]);
})();