(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', ['$http', '$q', '$cacheFactory', 'CategoryService', function($http, $q, $cacheFactory, CategoryService) {
    const self = this;
    const API_BASE = '/api/analytics/spending';
    const cache = $cacheFactory('analyticsCache');
    const CACHE_TTL = 300000;
    self.getSpendingData = function(filters) {
      const cacheKey = JSON.stringify(filters);
      const cached = cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return $q.resolve(cached.data);
      }
      const params = {};
      if (filters) {
        if (filters.dateRange) params.dateRange = filters.dateRange;
        if (filters.cardIds) params.cardIds = filters.cardIds.join(',');
        if (filters.categories) params.categories = filters.categories.join(',');
      }
      return $http.get(API_BASE, { params: params }).then(function(response) {
        cache.put(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
      }).catch(function(error) {
        if (cached) {
          return $q.resolve(cached.data);
        }
        return $q.reject(error);
      });
    };
    self.getMockAnalytics = function() {
      return $q.resolve({
        categoryBreakdown: [
          { category: 'Food & Dining', amount: 5000, percentage: 15 },
          { category: 'Fuel', amount: 8000, percentage: 24 },
          { category: 'Shopping', amount: 12000, percentage: 36 },
          { category: 'Travel', amount: 3000, percentage: 9 },
          { category: 'Entertainment', amount: 2000, percentage: 6 },
          { category: 'Utilities', amount: 1500, percentage: 4.5 },
          { category: 'Healthcare', amount: 1000, percentage: 3 },
          { category: 'Education', amount: 500, percentage: 1.5 },
          { category: 'Miscellaneous', amount: 333, percentage: 1 }
        ],
        monthlyTrends: [
          { month: 'Jan', totalSpend: 30000 },
          { month: 'Feb', totalSpend: 28000 },
          { month: 'Mar', totalSpend: 32000 },
          { month: 'Apr', totalSpend: 35000 },
          { month: 'May', totalSpend: 33000 },
          { month: 'Jun', totalSpend: 31000 }
        ],
        cardWiseSpend: [
          { cardId: '1', cardName: 'Visa Platinum', totalSpend: 15000 },
          { cardId: '2', cardName: 'MasterCard Gold', totalSpend: 8000 },
          { cardId: '3', cardName: 'Amex Blue', totalSpend: 10000 }
        ]
      });
    };
  }]);
})();