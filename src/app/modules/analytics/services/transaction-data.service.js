(function() {
  'use strict';
  angular.module('creditCardApp.analytics').service('TransactionDataService', ['$http', 'HistoricalDataFactory', function($http, HistoricalDataFactory) {
    var service = this;
    service.getHistoricalTransactions = function(userId, dateRange) {
      return HistoricalDataFactory.getHistoricalTransactions(userId, dateRange.startDate, dateRange.endDate).then(function(data) {
        return data;
      }).catch(function(error) {
        console.error('Error fetching historical transactions:', error);
        throw error;
      });
    };
  }]);
  TransactionDataService.$inject = ['$http', 'HistoricalDataFactory'];
})();