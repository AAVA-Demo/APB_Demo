(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .factory('CreditCardDataService', ['$http', '$q', function($http, $q) {
      var mockCards = [
        { cardId: 'card-001', creditLimit: 10000, availableCredit: 7500 },
        { cardId: 'card-002', creditLimit: 15000, availableCredit: 12000 },
        { cardId: 'card-003', creditLimit: 20000, availableCredit: 18000 }
      ];
      return {
        getCards: function() {
          return $q.resolve(mockCards);
        }
      };
    }]);
})();