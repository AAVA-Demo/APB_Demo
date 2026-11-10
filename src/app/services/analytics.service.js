(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getSpendingTrends: getSpendingTrends
      };
      return service;
      function getSpendingTrends(filter) {
        var deferred = $q.defer();
        var params = {
          startDate: filter.startDate || getDefaultStartDate(),
          endDate: filter.endDate || getDefaultEndDate()
        };
        if (filter.selectedCategories && filter.selectedCategories.length > 0) {
          params.categories = filter.selectedCategories.join(',');
        }
        if (filter.cardId) {
          params.cardId = filter.cardId;
        }
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/spending-trends', {
          params: params
        }).then(function(response) {
          var trends = response.data.map(function(trend) {
            return {
              month: trend.month,
              totalSpend: trend.totalSpend,
              categoryBreakdown: trend.categoryBreakdown || []
            };
          });
          deferred.resolve(trends);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
      function getDefaultStartDate() {
        var date = new Date();
        date.setMonth(date.getMonth() - 11);
        return date.toISOString().substring(0, 7);
      }
      function getDefaultEndDate() {
        return new Date().toISOString().substring(0, 7);
      }
    }]);
})();