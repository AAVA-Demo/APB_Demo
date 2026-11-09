(function() {
  'use strict';
  angular.module('creditCardApp').service('cardMetadataService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
    const cache = {};
    this.getCardMetadata = function(cardIds) {
      const promises = cardIds.map(function(cardId) {
        if (cache[cardId]) {
          return $q.resolve(cache[cardId]);
        }
        const url = apiConfig.baseUrl + apiConfig.endpoints.cardMetadata.replace('{id}', cardId);
        return $http.get(url, {timeout: apiConfig.timeout}).then(function(response) {
          cache[cardId] = response.data;
          return response.data;
        }, function(error) {
          console.error('Error fetching metadata for card:', cardId, error);
          const mockData = {cardId: cardId, rewardsProgram: 'Standard', annualFee: 0};
          cache[cardId] = mockData;
          return mockData;
        });
      });
      return $q.all(promises);
    };
  }]);
})();