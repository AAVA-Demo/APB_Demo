(function() {
  'use strict';
  angular.module('dashboardModule').service('DashboardService', DashboardService);
  DashboardService.$inject = ['$http', '$q', 'API_CONFIG', 'DashboardCache'];
  function DashboardService($http, $q, API_CONFIG, DashboardCache) {
    var vm = this;
    vm.getKPIs = function() {
      var cached = DashboardCache.get('kpis');
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard, { timeout: API_CONFIG.timeout })
        .then(function(response) {
          DashboardCache.put('kpis', response.data);
          return response.data;
        });
    };
    vm.getCreditCardSummary = function() {
      var cached = DashboardCache.get('cards');
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards, { timeout: API_CONFIG.timeout })
        .then(function(response) {
          DashboardCache.put('cards', response.data);
          return response.data;
        });
    };
    vm.refresh = function() {
      DashboardCache.removeAll();
      return $q.all([vm.getKPIs(), vm.getCreditCardSummary()]);
    };
  }
})();