(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('DashboardService', ['$q', '$cacheFactory', 'CreditCardDataService', 'KPICalculator', function($q, $cacheFactory, CreditCardDataService, KPICalculator) {
      const cache = $cacheFactory('dashboardCache');
      const CACHE_TTL = 300000;
      this.getKPIs = function(userId, forceRefresh) {
        const cacheKey = 'kpis_' + userId;
        if (!forceRefresh) {
          const cached = cache.get(cacheKey);
          if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return $q.resolve(cached.data);
          }
        }
        return CreditCardDataService.getAllCards(userId).then(function(cards) {
          const kpis = KPICalculator.calculateKPIs(cards);
          const result = {
            userId: userId,
            kpis: kpis,
            cards: cards,
            lastUpdated: new Date()
          };
          cache.put(cacheKey, { data: result, timestamp: Date.now() });
          return result;
        }).catch(function(error) {
          console.error('Error fetching KPIs:', error);
          const cached = cache.get(cacheKey);
          if (cached) {
            toastr.warning('Using cached data due to error');
            return cached.data;
          }
          return $q.reject(error);
        });
      };
    }]);
})();