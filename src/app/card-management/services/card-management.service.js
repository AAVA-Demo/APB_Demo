(function() {
  'use strict';
  angular.module('app.cardManagement').service('CardManagementService', ['$http', '$q', 'CardCacheFactory', function($http, $q, CardCacheFactory) {
    var API_BASE = '/api';
    this.getAllCards = function() {
      var cached = CardCacheFactory.get('cardList');
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_BASE + '/cards').then(function(response) {
        CardCacheFactory.set('cardList', response.data);
        return response.data;
      }).catch(function(err) {
        console.error('Get all cards error:', err);
        return $q.reject(err);
      });
    };
    this.getCardDetails = function(cardId) {
      var cached = CardCacheFactory.get('card_' + cardId);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get(API_BASE + '/cards/' + cardId).then(function(response) {
        CardCacheFactory.set('card_' + cardId, response.data);
        return response.data;
      }).catch(function(err) {
        console.error('Get card details error:', err);
        return $q.reject(err);
      });
    };
  }]);
})();