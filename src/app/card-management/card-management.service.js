(function() {
  'use strict';
  angular.module('app.cardManagement').service('CardManagementService', ['$http', '$q', '$cacheFactory', CardManagementService]);
  function CardManagementService($http, $q, $cacheFactory) {
    var vm = this;
    var cache = $cacheFactory('cardCache');
    vm.getAllCards = getAllCards;
    vm.getCardDetails = getCardDetails;
    vm.getCardSpendSummary = getCardSpendSummary;
    function getAllCards(forceRefresh) {
      if (forceRefresh) {
        cache.removeAll();
      }
      var cachedCards = cache.get('allCards');
      if (cachedCards) {
        return $q.resolve(cachedCards);
      }
      return $http.get('/api/cards').then(function(response) {
        var cards = response.data;
        cache.put('allCards', cards);
        return cards;
      }).catch(function(error) {
        console.error('Error fetching cards:', error);
        cache.removeAll();
        return $q.reject(error);
      });
    }
    function getCardDetails(cardId) {
      var cacheKey = 'card_' + cardId;
      var cachedCard = cache.get(cacheKey);
      if (cachedCard) {
        return $q.resolve(cachedCard);
      }
      return $http.get('/api/cards/' + cardId).then(function(response) {
        var card = response.data;
        cache.put(cacheKey, card);
        return card;
      }).catch(function(error) {
        console.error('Error fetching card details:', error);
        return $q.reject(error);
      });
    }
    function getCardSpendSummary(cardId) {
      return $http.get('/api/cards/' + cardId + '/spend-summary').then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Error fetching spend summary:', error);
        return {
          cardId: cardId,
          monthlySpend: 0,
          categoryBreakdown: [],
          lastTransactionDate: null
        };
      });
    }
  }
})();