(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getSpendingAnalytics = function(dateRange) {
        var deferred = $q.defer();
        var params = {
          from: moment(dateRange.from).format('YYYY-MM-DD'),
          to: moment(dateRange.to).format('YYYY-MM-DD')
        };
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics, { params: params, timeout: API_CONFIG.timeout })
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();