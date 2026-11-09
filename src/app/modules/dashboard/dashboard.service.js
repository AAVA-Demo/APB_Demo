(function() {
  'use strict';
  angular.module('creditcard.dashboard')
    .service('DashboardService', ['CreditCardDataFactory', '$window', DashboardService]);
  function DashboardService(CreditCardDataFactory, $window) {
    var service = {
      getKPIs: getKPIs
    };
    return service;
    function getKPIs() {
      return CreditCardDataFactory.fetchAllCards()
        .then(function(cards) {
          var calculator = new $window.KPICalculator();
          return calculator.calculateKPIs(cards);
        });
    }
  }
})();