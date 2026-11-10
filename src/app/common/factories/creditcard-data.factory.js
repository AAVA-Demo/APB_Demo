(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
      var mockData = {
        totalLimit: 50000,
        totalOutstanding: 12500,
        cardCount: 3
      };
      return {
        getSummary: function() {
          return $q.resolve(mockData);
        }
      };
    }]);
})();