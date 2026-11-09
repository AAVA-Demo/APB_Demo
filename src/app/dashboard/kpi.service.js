(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KpiService', ['$http', 'ApiService', '$q', function($http, ApiService, $q) {
      var cachedData = null;
      var cacheTimestamp = null;
      var cacheDuration = 30000;
      this.getKpiData = function() {
        var now = new Date().getTime();
        if (cachedData && cacheTimestamp && (now - cacheTimestamp < cacheDuration)) {
          return $q.resolve(cachedData);
        }
        return ApiService.get('/kpi/dashboard').then(function(response) {
          cachedData = response.data;
          cacheTimestamp = new Date().getTime();
          return cachedData;
        }).catch(function(error) {
          console.error('Failed to fetch KPI data:', error);
          return $q.reject(error);
        });
      };
      this.clearCache = function() {
        cachedData = null;
        cacheTimestamp = null;
      };
    }]);
  KpiService.$inject = ['$http', 'ApiService', '$q'];
})();