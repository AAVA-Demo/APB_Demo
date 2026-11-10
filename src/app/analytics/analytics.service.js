(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', AnalyticsService);
  AnalyticsService.$inject = ['TransactionDataFactory', 'AnalyticsEngineFactory', '$q'];
  function AnalyticsService(TransactionDataFactory, AnalyticsEngineFactory, $q) {
    var vm = this;
    vm.loadAnalytics = loadAnalytics;
    vm.filterAnalytics = filterAnalytics;
    function loadAnalytics() {
      return TransactionDataFactory.fetchTransactions().then(function(transactions) {
        return AnalyticsEngineFactory.processAnalytics(transactions);
      });
    }
    function filterAnalytics(filters) {
      return TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var filtered = transactions;
        if (filters.startDate) {
          filtered = filtered.filter(function(t) {
            return new Date(t.date) >= new Date(filters.startDate);
          });
        }
        if (filters.endDate) {
          filtered = filtered.filter(function(t) {
            return new Date(t.date) <= new Date(filters.endDate);
          });
        }
        if (filters.category) {
          filtered = filtered.filter(function(t) {
            return t.category === filters.category;
          });
        }
        if (filters.cardId) {
          filtered = filtered.filter(function(t) {
            return t.cardId === filters.cardId;
          });
        }
        return AnalyticsEngineFactory.processAnalytics(filtered);
      });
    }
  }
})();