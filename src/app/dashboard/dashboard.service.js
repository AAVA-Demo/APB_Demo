(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$q', 'CreditCardFactory', 'AggregationService', function($q, CreditCardFactory, AggregationService) {
      this.getKPIs = function() {
        return CreditCardFactory.fetchCreditCards()
          .then(function(cards) {
            return AggregationService.aggregate(cards);
          });
      };
    }]);
})();