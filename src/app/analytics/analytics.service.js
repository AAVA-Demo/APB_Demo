(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var cache = {};
      var cacheTTL = 60000;
      self.getSpendingData = function(userId, filters) {
        var cacheKey = 'analytics_' + userId + '_' + JSON.stringify(filters);
        var now = Date.now();
        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < cacheTTL)) {
          return $q.resolve(cache[cacheKey].data);
        }
        var params = { userId: userId };
        if (filters.selectedCategories && filters.selectedCategories.length > 0) {
          params.categories = filters.selectedCategories.join(',');
        }
        if (filters.dateRange && filters.dateRange.from) {
          params.dateFrom = filters.dateRange.from.toISOString();
        }
        if (filters.dateRange && filters.dateRange.to) {
          params.dateTo = filters.dateRange.to.toISOString();
        }
        if (filters.selectedCards && filters.selectedCards.length > 0) {
          params.cards = filters.selectedCards.join(',');
        }
        var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics;
        return $http.get(url, { params: params, timeout: API_CONFIG.timeout })
          .then(function(response) {
            var data = response.data || self._getMockAnalyticsData();
            cache[cacheKey] = { data: data, timestamp: now };
            return data;
          })
          .catch(function(error) {
            console.error('Analytics fetch error:', error);
            if (cache[cacheKey]) {
              return cache[cacheKey].data;
            }
            return self._getMockAnalyticsData();
          });
      };
      self._getMockAnalyticsData = function() {
        return {
          userId: 'user123',
          timeRange: { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') },
          categorySpending: [
            { category: 'Food & Dining', amount: 850, percentage: 20 },
            { category: 'Fuel', amount: 320, percentage: 7.5 },
            { category: 'Shopping', amount: 1200, percentage: 28.2 },
            { category: 'Travel', amount: 1500, percentage: 35.3 },
            { category: 'Entertainment', amount: 180, percentage: 4.2 },
            { category: 'Utilities', amount: 120, percentage: 2.8 },
            { category: 'Healthcare', amount: 50, percentage: 1.2 },
            { category: 'Education', amount: 30, percentage: 0.7 },
            { category: 'Miscellaneous', amount: 0, percentage: 0.1 }
          ],
          monthlyTrends: [
            { month: 'Nov 2023', totalSpend: 3800, categoryBreakdown: {} },
            { month: 'Dec 2023', totalSpend: 4100, categoryBreakdown: {} },
            { month: 'Jan 2024', totalSpend: 4250, categoryBreakdown: {} }
          ],
          cardWiseSpending: [
            { cardId: 'card1', cardName: 'Platinum Rewards', totalSpend: 2100, categoryBreakdown: {} },
            { cardId: 'card2', cardName: 'Gold Cashback', totalSpend: 1200, categoryBreakdown: {} },
            { cardId: 'card3', cardName: 'Travel Elite', totalSpend: 950, categoryBreakdown: {} }
          ]
        };
      };
    }]);
})();