(function() {
  'use strict';
  angular.module('dashboardModule').factory('KPIFactory', KPIFactory);
  KPIFactory.$inject = ['$http', 'API_ENDPOINTS'];
  function KPIFactory($http, API_ENDPOINTS) {
    return {
      fetchKPIs: fetchKPIs
    };
    function fetchKPIs() {
      return $http.get(API_ENDPOINTS.kpis).then(function(response) {
        return response.data;
      }).catch(function() {
        return {
          totalCreditLimit: 80000,
          totalOutstandingAmount: 23000,
          totalAvailableCredit: 57000,
          totalMonthlySpend: 13700
        };
      });
    }
  }
})();