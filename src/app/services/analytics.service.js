(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsService', ['$http', '$q', function($http, $q) {
      var service = {
        getSpendingData: getSpendingData
      };
      return service;
      function getSpendingData(dateRange) {
        var params = dateRange ? { dateRange: dateRange } : {};
        return $http.get('/api/analytics/spending', { params: params })
          .then(function(response) {
            return new window.SpendingModel(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching spending data:', error);
            return $q.reject(error);
          });
      }
    }]);
})();