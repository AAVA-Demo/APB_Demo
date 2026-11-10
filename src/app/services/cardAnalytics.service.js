(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardAnalyticsService', ['$q', function($q) {
      this.calculateMetrics = function(cardData) {
        var deferred = $q.defer();
        var metrics = {
          cardId: cardData.cardId,
          monthlySpend: cardData.outstandingAmount || 0,
          totalTransactions: Math.floor(Math.random() * 50) + 10,
          averageTransactionAmount: cardData.outstandingAmount ? (cardData.outstandingAmount / (Math.floor(Math.random() * 20) + 5)).toFixed(2) : 0,
          lastTransactionDate: new Date()
        };
        deferred.resolve(metrics);
        return deferred.promise;
      };
    }]);
})();