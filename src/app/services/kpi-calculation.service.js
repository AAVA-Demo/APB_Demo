(function() {
  'use strict';
  angular.module('creditCardApp').service('KpiCalculationService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    const CACHE_DURATION = 300000;
    let cachedKpis = null;
    let cacheTimestamp = null;
    
    this.fetchKpis = function() {
      const now = Date.now();
      if (cachedKpis && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        return $q.resolve(cachedKpis);
      }
      
      const deferred = $q.defer();
      const token = AuthService.getToken();
      const user = AuthService.getCurrentUser();
      
      const mockKpis = {
        userId: user.userId,
        monthlySpend: 4250.75,
        totalCreditLimit: 50000,
        availableCredit: 38500,
        outstandingAmount: 11500,
        lastUpdated: new Date(),
        cardCount: 5
      };
      
      cachedKpis = mockKpis;
      cacheTimestamp = now;
      deferred.resolve(mockKpis);
      
      return deferred.promise;
    };
    
    this.clearCache = function() {
      cachedKpis = null;
      cacheTimestamp = null;
    };
  }]);
})();