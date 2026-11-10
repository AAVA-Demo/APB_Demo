(function() {
  'use strict';
  angular.module('app.analytics')
    .service('TransactionService', ['$http', '$q', 'MockDataService', function($http, $q, MockDataService) {
      this.getTransactions = function(cardId, startDate, endDate) {
        return MockDataService.getTransactions(cardId, startDate, endDate);
      };
      
      this.getCards = function() {
        return MockDataService.getAllCards();
      };
    }]);
})();