(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['$http', '$q', function($http, $q) {
      const API_BASE = '/api/dashboard';
      this.getKPIData = function(userId) {
        return $http.get(`${API_BASE}/kpis?userId=${userId}`)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
    }]);
})();