(function() {
  'use strict';
  angular.module('creditCardApp').service('dashboardService', ['$http', '$q', 'authFactory', function($http, $q, authFactory) {
    var cache = null;
    var cacheTime = null;
    var cacheTTL = 2000;
    this.getKPIs = function() {
      var now = new Date().getTime();
      if (cache && cacheTime && (now - cacheTime < cacheTTL)) {
        return $q.resolve(cache);
      }
      var userId = authFactory.getUserId();
      return $http.get('/api/dashboard/kpis', { params: { userId: userId } }).then(function(response) {
        cache = response.data;
        cacheTime = now;
        return cache;
      }).catch(function(error) {
        return $http.get('src/app/dashboard/mock-kpis.json').then(function(mockResponse) {
          cache = mockResponse.data;
          cacheTime = now;
          return cache;
        });
      });
    };
  }]);
})();