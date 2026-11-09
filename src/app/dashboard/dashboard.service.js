(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', DashboardService);
  DashboardService.$inject = ['$http', '$q', 'AuthFactory', 'MockDataService'];
  function DashboardService($http, $q, AuthFactory, MockDataService) {
    var cache = null;
    this.getKPIs = function() {
      if (cache) {
        return $q.resolve(cache);
      }
      if (!AuthFactory.validateSession()) {
        return $q.reject('Unauthorized');
      }
      var deferred = $q.defer();
      try {
        var data = MockDataService.getAggregatedMetrics();
        cache = data;
        deferred.resolve(data);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
  }
})();