(function() {
  'use strict';
  angular.module('creditCardApp').service('CardDataService', CardDataService);
  CardDataService.$inject = ['$http', '$q', '$cacheFactory', '$rootScope'];
  function CardDataService($http, $q, $cacheFactory, $rootScope) {
    var service = this;
    var cache = $cacheFactory('cardCache');
    service.getAllCards = getAllCards;
    service.getCardDetails = getCardDetails;
    function getAllCards() {
      var cachedCards = cache.get('allCards');
      if (cachedCards) {
        return $q.resolve(cachedCards);
      }
      return $http.get($rootScope.apiBaseUrl + '/api/cards').then(function(response) {
        var cards = response.data.map(function(card) {
          return maskCardNumber(card);
        });
        cache.put('allCards', cards);
        setTimeout(function() {
          cache.remove('allCards');
        }, 300000);
        return cards;
      }).catch(function(error) {
        console.error('Error fetching cards:', error);
        return $q.reject(error);
      });
    }
    function getCardDetails(cardId) {
      return $http.get($rootScope.apiBaseUrl + '/api/cards/' + cardId).then(function(response) {
        return maskCardNumber(response.data);
      }).catch(function(error) {
        console.error('Error fetching card details:', error);
        return $q.reject(error);
      });
    }
    function maskCardNumber(card) {
      if (card.cardNumber && card.cardNumber.length >= 4) {
        var lastFour = card.cardNumber.slice(-4);
        card.cardNumber = '**** **** **** ' + lastFour;
      }
      return card;
    }
  }
})();