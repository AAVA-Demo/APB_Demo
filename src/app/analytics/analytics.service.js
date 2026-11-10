(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', 'CategorizationFactory', 'AggregationService', 'ApiService', function($http, CategorizationFactory, AggregationService, ApiService) {
      this.loadAnalytics = function() {
        return ApiService.get('/transactions', {all: true}).then(function(response) {
          var transactions = response.transactions || [];
          var categorizedTransactions = CategorizationFactory.categorizeTransactions(transactions);
          var aggregatedData = AggregationService.aggregateData(categorizedTransactions);
          return aggregatedData;
        });
      };
    }]);
  AnalyticsService.$inject = ['$http', 'CategorizationFactory', 'AggregationService', 'ApiService'];
})();