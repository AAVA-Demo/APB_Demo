(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('AnalyticsService', ['$http', '$q', 'AuthService', '$cacheFactory', function($http, $q, AuthService, $cacheFactory) {
      var cache = $cacheFactory('analyticsCache');
      var service = {
        getCategorySpend: getCategorySpend,
        getMonthlyTrends: getMonthlyTrends,
        getCardComparison: getCardComparison
      };
      return service;
      function getCategorySpend(filter) {
        var cacheKey = 'categorySpend_' + JSON.stringify(filter);
        var cached = cache.get(cacheKey);
        if (cached) return $q.resolve(cached);
        var params = buildParams(filter);
        return $http({
          method: 'GET',
          url: '/api/analytics/category',
          params: params,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          cache.put(cacheKey, response.data);
          setTimeout(function() { cache.remove(cacheKey); }, 300000);
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            var mockData = generateMockCategoryData();
            return mockData;
          }
          return $q.reject(error);
        });
      }
      function getMonthlyTrends(filter) {
        var cacheKey = 'monthlyTrends_' + JSON.stringify(filter);
        var cached = cache.get(cacheKey);
        if (cached) return $q.resolve(cached);
        var params = buildParams(filter);
        return $http({
          method: 'GET',
          url: '/api/analytics/trends',
          params: params,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          cache.put(cacheKey, response.data);
          setTimeout(function() { cache.remove(cacheKey); }, 300000);
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            var mockData = generateMockTrendData();
            return mockData;
          }
          return $q.reject(error);
        });
      }
      function getCardComparison(filter) {
        var cacheKey = 'cardComparison_' + JSON.stringify(filter);
        var cached = cache.get(cacheKey);
        if (cached) return $q.resolve(cached);
        var params = buildParams(filter);
        return $http({
          method: 'GET',
          url: '/api/analytics/cards',
          params: params,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          cache.put(cacheKey, response.data);
          setTimeout(function() { cache.remove(cacheKey); }, 300000);
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            var mockData = generateMockCardData();
            return mockData;
          }
          return $q.reject(error);
        });
      }
      function buildParams(filter) {
        var params = {};
        if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
        if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
        if (filter.cardIds && filter.cardIds.length) params.cardIds = filter.cardIds.join(',');
        return params;
      }
      function generateMockCategoryData() {
        var categories = [
          {category: 'Food & Dining', amount: 8500, percentage: 34, transactionCount: 45, color: '#FF6384'},
          {category: 'Fuel', amount: 3200, percentage: 13, transactionCount: 18, color: '#36A2EB'},
          {category: 'Shopping', amount: 6800, percentage: 27, transactionCount: 32, color: '#FFCE56'},
          {category: 'Travel', amount: 2500, percentage: 10, transactionCount: 8, color: '#4BC0C0'},
          {category: 'Entertainment', amount: 1800, percentage: 7, transactionCount: 12, color: '#9966FF'},
          {category: 'Utilities', amount: 1200, percentage: 5, transactionCount: 6, color: '#FF9F40'},
          {category: 'Healthcare', amount: 600, percentage: 2, transactionCount: 3, color: '#FF6384'},
          {category: 'Education', amount: 300, percentage: 1, transactionCount: 2, color: '#C9CBCF'},
          {category: 'Miscellaneous', amount: 100, percentage: 1, transactionCount: 4, color: '#4BC0C0'}
        ];
        return categories;
      }
      function generateMockTrendData() {
        var trends = [];
        for (var i = 5; i >= 0; i--) {
          var date = new Date();
          date.setMonth(date.getMonth() - i);
          var month = date.toISOString().substring(0, 7);
          trends.push({
            month: month,
            totalSpend: 20000 + Math.floor(Math.random() * 10000),
            cardBreakdown: [
              {cardId: 'c1', amount: 8000 + Math.floor(Math.random() * 4000)},
              {cardId: 'c2', amount: 6000 + Math.floor(Math.random() * 3000)},
              {cardId: 'c3', amount: 4000 + Math.floor(Math.random() * 2000)}
            ]
          });
        }
        return trends;
      }
      function generateMockCardData() {
        return [
          {cardId: 'c1', cardNumber: '**** 1234', totalSpend: 12000, categoryBreakdown: [{category: 'Food & Dining', amount: 4000}, {category: 'Shopping', amount: 3500}, {category: 'Fuel', amount: 2000}, {category: 'Travel', amount: 1500}, {category: 'Entertainment', amount: 1000}]},
          {cardId: 'c2', cardNumber: '**** 5678', totalSpend: 8000, categoryBreakdown: [{category: 'Food & Dining', amount: 3000}, {category: 'Shopping', amount: 2000}, {category: 'Fuel', amount: 1500}, {category: 'Utilities', amount: 1000}, {category: 'Entertainment', amount: 500}]},
          {cardId: 'c3', cardNumber: '**** 9012', totalSpend: 5000, categoryBreakdown: [{category: 'Food & Dining', amount: 1500}, {category: 'Shopping', amount: 1300}, {category: 'Fuel', amount: 700}, {category: 'Travel', amount: 1000}, {category: 'Healthcare', amount: 500}]}
        ];
      }
    }]);
})();