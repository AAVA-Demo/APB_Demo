(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('DashboardService', ['$http', '$q', '$cacheFactory', DashboardService]);

  function DashboardService($http, $q, $cacheFactory) {
    var cache = $cacheFactory('dashboardCache');
    var service = {
      getPortfolio: getPortfolio
    };
    return service;

    function getPortfolio() {
      var deferred = $q.defer();
      var cacheKey = 'portfolio';
      var cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        deferred.resolve(cachedData);
        return deferred.promise;
      }

      $http.get('/api/dashboard/portfolio')
        .then(function(response) {
          cache.put(cacheKey, response.data);
          setTimeout(function() {
            cache.remove(cacheKey);
          }, 10000);
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      
      return deferred.promise;
    }
  }
})();