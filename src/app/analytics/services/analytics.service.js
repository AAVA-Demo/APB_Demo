(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('AnalyticsService', ['$q', 'CategorizationService', 'VisualizationService', AnalyticsService]);

  function AnalyticsService($q, CategorizationService, VisualizationService) {
    return {
      getSpendingAnalytics: getSpendingAnalytics
    };

    function getSpendingAnalytics(filters) {
      var period = (filters && filters.period) || '12months';
      return CategorizationService.getCategorizedTransactions(period)
        .then(function(spendingData) {
          return {
            monthlyTrends: VisualizationService.prepareMonthlyTrendsData(spendingData.monthlyTrends || []),
            categoryWise: VisualizationService.prepareCategoryData(spendingData.categoryWiseSpend || []),
            cardWise: VisualizationService.prepareCardWiseData(spendingData.cardWiseSpend || [])
          };
        })
        .catch(function(error) {
          console.error('Error getting spending analytics:', error);
          return $q.reject(error);
        });
    }
  }
})();