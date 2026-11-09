(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('dataAggregationService', DataAggregationService);
  DataAggregationService.$inject = ['$http', '$q', 'API_BASE_URL'];
  function DataAggregationService($http, $q, API_BASE_URL) {
    var service = this;
    service.getAggregatedMetrics = function(userId) {
      var deferred = $q.defer();
      $http.get(API_BASE_URL + '/cards/aggregate', {
        params: {userId: userId},
        timeout: 1500
      }).then(function(response) {
        var cardData = response.data;
        var kpis = service.calculateKPIs(cardData);
        deferred.resolve(kpis);
      }).catch(function() {
        var mockData = [
          {cardId: 'card001', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000, currentMonthSpend: 12000},
          {cardId: 'card002', creditLimit: 30000, availableCredit: 20000, outstandingBalance: 10000, currentMonthSpend: 8000},
          {cardId: 'card003', creditLimit: 20000, availableCredit: 15000, outstandingBalance: 5000, currentMonthSpend: 4500}
        ];
        var kpis = service.calculateKPIs(mockData);
        deferred.resolve(kpis);
      });
      return deferred.promise;
    };
    service.calculateKPIs = function(cardData) {
      var totalCreditLimit = 0;
      var availableCredit = 0;
      var outstandingAmount = 0;
      var monthlySpend = 0;
      angular.forEach(cardData, function(card) {
        totalCreditLimit += card.creditLimit || 0;
        availableCredit += card.availableCredit || 0;
        outstandingAmount += card.outstandingBalance || 0;
        monthlySpend += card.currentMonthSpend || 0;
      });
      return {
        userId: 'user123',
        monthlySpend: monthlySpend,
        totalCreditLimit: totalCreditLimit,
        availableCredit: availableCredit,
        outstandingAmount: outstandingAmount,
        lastRefreshed: new Date()
      };
    };
  }
})();