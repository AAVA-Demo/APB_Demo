(function() {
  'use strict';
  angular.module('creditCard.trends')
    .service('TrendAnalysisService', ['HistoricalDataFactory', 'TimeSeriesProcessorService', 'CardwiseAnalyticsService', function(HistoricalDataFactory, TimeSeriesProcessorService, CardwiseAnalyticsService) {
      this.getTrendData = function(dateRange, cardIds) {
        return HistoricalDataFactory.fetchHistoricalData(dateRange)
          .then(function(transactions) {
            let filtered = transactions;
            if (cardIds && cardIds.length > 0) {
              filtered = transactions.filter(function(t) {
                return cardIds.indexOf(t.cardId) !== -1;
              });
            }
            const monthlyTrends = TimeSeriesProcessorService.aggregateByMonth(filtered);
            const cardwiseData = CardwiseAnalyticsService.analyzeByCard(filtered);
            return {
              monthlyTrends: monthlyTrends,
              cardwiseData: cardwiseData,
              dateRange: dateRange
            };
          });
      };
    }]);
})();