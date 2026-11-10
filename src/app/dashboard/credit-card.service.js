(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('CreditCardService', ['$http', '$q', function($http, $q) {
      this.getAllCards = function() {
        return $http.get('/api/cards').then(function(response) {
          return response.data;
        }).catch(function() {
          return [
            {cardId: 'card1', creditLimit: 50000, outstandingBalance: 12500},
            {cardId: 'card2', creditLimit: 30000, outstandingBalance: 8000},
            {cardId: 'card3', creditLimit: 20000, outstandingBalance: 5000}
          ];
        });
      };
    }]);
})();