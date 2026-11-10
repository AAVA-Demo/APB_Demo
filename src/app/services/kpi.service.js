(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPIService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getKPIData: getKPIData
      };
      return service;
      function getKPIData() {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi, {
          cache: false
        }).then(function(response) {
          var kpiData = {
            monthlySpend: response.data.monthlySpend || 0,
            totalCreditLimit: response.data.totalCreditLimit || 0,
            availableCredit: response.data.availableCredit || 0,
            outstandingAmount: response.data.outstandingAmount || 0,
            utilizationRate: response.data.utilizationRate || 0,
            lastUpdated: new Date(response.data.lastUpdated || Date.now())
          };
          deferred.resolve(kpiData);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    }]);
})();