(function() {
  'use strict';
  angular.module('creditCardApp').service('cardAnalyticsService', ['$http', '$q', function($http, $q) {
    this.getCardSpendAnalysis = function(cardId) {
      return $http.get('/api/cards/' + cardId + '/analytics').then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $http.get('src/app/card-management/mock-card-analytics.json').then(function(mockResponse) {
          return mockResponse.data;
        });
      });
    };
  }]);
})();