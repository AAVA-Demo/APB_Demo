(function() {
  'use strict';
  angular.module('dashboard.module')
    .service('DashboardService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      let cache = null;
      let cacheTimestamp = null;
      const CACHE_TTL = 30000;
      this.getKPIs = function() {
        const now = Date.now();
        if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
          return $q.resolve(cache);
        }
        const mockData = {
          userId: AuthService.getUserId(),
          monthlySpend: 3245.67,
          totalCreditLimit: 25000.00,
          availableCredit: 18754.33,
          outstandingAmount: 6245.67,
          currency: 'USD',
          lastUpdated: new Date().toISOString()
        };
        cache = mockData;
        cacheTimestamp = now;
        return $q.resolve(mockData);
      };
      this.clearCache = function() {
        cache = null;
        cacheTimestamp = null;
      };
    }]);
})();