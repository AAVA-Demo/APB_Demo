(function() {
  'use strict';
  angular.module('dashboardModule').service('PortfolioService', ['$http', '$q', function($http, $q) {
    const self = this;
    const API_BASE = '/api/portfolio';
    self.getPortfolio = function() {
      return $http.get(API_BASE).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();