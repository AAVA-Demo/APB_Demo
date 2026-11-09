(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', '$cacheFactory', CreditCardDataService]);
  function CreditCardDataService($http, $q, API_CONFIG, $cacheFactory) {
    const cache = $cacheFactory('creditCardDataCache');
    const service = {
      getCreditCardSummary: getCreditCardSummary
    };
    return service;
    function getCreditCardSummary() {
      const cacheKey = 'cardSummary';
      const cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary)
        .then(function(response) {
          const summary = response.data || generateMockSummary();
          cache.put(cacheKey, summary);
          setTimeout(function() { cache.remove(cacheKey); }, API_CONFIG.cacheTimeout);
          return summary;
        })
        .catch(function() {
          const mockData = generateMockSummary();
          return mockData;
        });
    }
    function generateMockSummary() {
      return {
        totalCards: 3,
        totalCreditLimit: 150000,
        totalAvailableCredit: 95000,
        totalOutstanding: 55000
      };
    }
  }
})();