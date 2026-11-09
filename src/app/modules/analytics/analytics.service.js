(function() {
  'use strict';
  angular.module('creditcard.analytics')
    .service('AnalyticsService', ['TransactionDataFactory', '$window', AnalyticsService]);
  function AnalyticsService(TransactionDataFactory, $window) {
    var service = {
      getAnalytics: getAnalytics
    };
    return service;
    function getAnalytics() {
      return TransactionDataFactory.fetchTransactions()
        .then(function(transactions) {
          var engine = new $window.CategoryEngine();
          return engine.categorizeAndAggregate(transactions);
        });
    }
  }
})();