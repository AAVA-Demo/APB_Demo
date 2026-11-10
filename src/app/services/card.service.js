(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardService', ['$http', '$q', function($http, $q) {
      var userId = 'current';
      this.getAllCards = function() {
        return $http.get('/api/users/' + userId + '/cards').then(function(response) {
          var cards = response.data || [];
          return cards.map(function(card) {
            card.utilizationPercent = card.creditLimit > 0 ? (card.currentBalance / card.creditLimit) * 100 : 0;
            return card;
          });
        }).catch(function(error) {
          console.error('Failed to fetch cards:', error);
          return $q.reject(error);
        });
      };
      this.getCardById = function(cardId) {
        return $http.get('/api/cards/' + cardId).then(function(response) {
          var card = response.data;
          card.utilizationPercent = card.creditLimit > 0 ? (card.currentBalance / card.creditLimit) * 100 : 0;
          return card;
        }).catch(function(error) {
          console.error('Failed to fetch card:', error);
          return $q.reject(error);
        });
      };
      this.getCardSpendAnalysis = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/spend-analysis').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Failed to fetch spend analysis:', error);
          return $q.reject(error);
        });
      };
    }]);
})();