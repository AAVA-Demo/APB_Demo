(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = this;
      service.getMonthlyTrends = function(startDate, endDate) {
        var deferred = $q.defer();
        var params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_TRENDS, { params: params, timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching monthly trends:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      service.getCategoryBreakdown = function(startDate, endDate) {
        var deferred = $q.defer();
        var params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_CATEGORIES, { params: params, timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching category breakdown:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      service.getCardWiseSpend = function(startDate, endDate) {
        var deferred = $q.defer();
        var params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_CARDS, { params: params, timeout: API_CONFIG.TIMEOUT })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching card-wise spend:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();