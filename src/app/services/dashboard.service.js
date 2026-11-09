(function() {
  'use strict';
  angular.module('creditCardApp').service('DashboardService', ['CreditCardApiService', 'KPIAggregator', '$q', function(CreditCardApiService, KPIAggregator, $q) {
    this.getKPIs = function() {
      return CreditCardApiService.getAllCards().then(function(cards) {
        return KPIAggregator.aggregate(cards);
      });
    };
  }]);
})();