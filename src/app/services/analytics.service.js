(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', AnalyticsService);
  AnalyticsService.$inject = ['$http', '$q', '$rootScope'];
  function AnalyticsService($http, $q, $rootScope) {
    var service = this;
    service.getCategorySpending = getCategorySpending;
    function getCategorySpending(startDate, endDate) {
      var params = {
        startDate: startDate || getDefaultStartDate(),
        endDate: endDate || new Date().toISOString()
      };
      return $http.get($rootScope.apiBaseUrl + '/api/analytics/spending', { params: params })
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Error fetching analytics:', error);
          return $q.reject(error);
        });
    }
    function getDefaultStartDate() {
      var date = new Date();
      date.setMonth(date.getMonth() - 12);
      return date.toISOString();
    }
  }
})();