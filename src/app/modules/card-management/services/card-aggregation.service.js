(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('cardAggregationService', CardAggregationService);
  CardAggregationService.$inject = ['$http', '$q', 'API_BASE_URL'];
  function CardAggregationService($http, $q, API_BASE_URL) {
    var service = this;
    service.getCardSpendAnalysis = function(cardId) {
      var deferred = $q.defer();
      $http.get(API_BASE_URL + '/cards/' + cardId + '/analysis').then(function(response) {
        deferred.resolve(response.data);
      }).catch(function() {
        var mockAnalysis = {
          cardId: cardId,
          monthlySpend: 12000 + Math.random() * 5000,
          trendData: [
            {month: 'Oct', amount: 10000},
            {month: 'Nov', amount: 11500},
            {month: 'Dec', amount: 13000},
            {month: 'Jan', amount: 12000}
          ],
          lastUpdated: new Date()
        };
        deferred.resolve(mockAnalysis);
      });
      return deferred.promise;
    };
  }
})();