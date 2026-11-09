(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AnalyticsService', ['$http', '$q', AnalyticsService]);

  function AnalyticsService($http, $q) {
    var service = {
      getMonthlyTrends: getMonthlyTrends,
      getCardWiseSpending: getCardWiseSpending,
      getCategorySpending: getCategorySpending
    };
    return service;

    function getMonthlyTrends() {
      var deferred = $q.defer();
      $http.get('/api/analytics/monthly-trends', { params: { months: 12 } })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function getCardWiseSpending() {
      var deferred = $q.defer();
      $http.get('/api/analytics/card-spending')
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function getCategorySpending() {
      var deferred = $q.defer();
      $http.get('/api/analytics/category-spending')
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }
  }
})();