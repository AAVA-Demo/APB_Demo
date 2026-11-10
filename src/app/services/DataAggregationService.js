(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('DataAggregationService', ['CardDataService', 'KpiCalculationService', '$q', function(CardDataService, KpiCalculationService, $q) {
      return {
        getConsolidatedKPIs: function(userId) {
          return CardDataService.getAllCards(userId)
            .then(function(cards) {
              return KpiCalculationService.calculateKPIs(cards);
            });
        }
      };
    }]);
})();