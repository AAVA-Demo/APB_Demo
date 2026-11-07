(function() {
  'use strict';
  angular.module('ccDashboardModule').service('CreditCardService', ['$q', 'ApiService', 'CreditCard', function($q, ApiService, CreditCard) {
    var self = this;
    self.getAllCards = function() {
      var deferred = $q.defer();
      ApiService.get('/api/creditcards').then(function(response) {
        var cards = response.data.map(function(cardData) {
          return new CreditCard(cardData);
        });
        deferred.resolve(cards);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    self.getCardById = function(cardId) {
      var deferred = $q.defer();
      self.getAllCards().then(function(cards) {
        var card = cards.find(function(c) { return c.id === cardId; });
        if (card) {
          deferred.resolve(card);
        } else {
          deferred.reject({ message: 'Card not found' });
        }
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();