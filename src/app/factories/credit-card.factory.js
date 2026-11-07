(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardFactory', ['$http', '$q', function($http, $q) {
      return {
        getCardSummary: function(userId) {
          return $http.get('/api/cards/summary', { params: { userId: userId } })
            .then(function(response) {
              return response.data.cards || [];
            })
            .catch(function(error) {
              console.error('Card summary fetch error:', error);
              var mockCards = [
                { cardId: 'card1', creditLimit: 50000, outstandingAmount: 12000 },
                { cardId: 'card2', creditLimit: 30000, outstandingAmount: 8500 },
                { cardId: 'card3', creditLimit: 20000, outstandingAmount: 5000 }
              ];
              return mockCards;
            });
        }
      };
    }]);
})();