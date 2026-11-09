(function() {
  'use strict';
  angular.module('creditCardApp').service('analyticsService', ['$http', '$q', 'authFactory', function($http, $q, authFactory) {
    var cache = {};
    var cacheTTL = 3000;
    this.getSpendingAnalytics = function(month) {
      var cacheKey = 'analytics_' + month;
      var now = new Date().getTime();
      if (cache[cacheKey] && (now - cache[cacheKey].time < cacheTTL)) {
        return $q.resolve(cache[cacheKey].data);
      }
      var userId = authFactory.getUserId();
      return $http.get('/api/analytics/spending', { params: { month: month, userId: userId } }).then(function(response) {
        cache[cacheKey] = { data: response.data, time: now };
        return response.data;
      }).catch(function(error) {
        return $http.get('src/app/analytics/mock-analytics.json').then(function(mockResponse) {
          cache[cacheKey] = { data: mockResponse.data, time: now };
          return mockResponse.data;
        });
      });
    };
    this.getCategoryTransactions = function(category, month) {
      return $http.get('/api/analytics/category/' + category + '/transactions', { params: { month: month } }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $http.get('src/app/analytics/mock-category-transactions.json').then(function(mockResponse) {
          return mockResponse.data;
        });
      });
    };
  }]);
})();