(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TrendAnalysisService', ['$http', '$q', function($http, $q) {
      const API_BASE = '/api/trends';
      this.getMonthlyTrends = function(request) {
        return $http.get(API_BASE + '/monthly', { params: request }).then(function(response) {
          return response.data;
        });
      };
      this.getCardWiseSpend = function(request) {
        return $http.get(API_BASE + '/cardwise', { params: request }).then(function(response) {
          return response.data;
        });
      };
      this.getAllTrendData = function(request) {
        return $q.all({
          monthly: this.getMonthlyTrends(request),
          cardwise: this.getCardWiseSpend(request)
        });
      };
    }]);
})();