(function() {
  'use strict';
  angular.module('creditCardApp').service('cardInfoService', ['$http', '$q', 'authService', function($http, $q, authService) {
    var self = this;
    self.getCards = function() {
      var token = authService.getToken();
      return $http.get('/api/cards', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(function(response) {
        var cards = response.data;
        return cards.map(function(card) {
          card.cardNumber = self.maskCardNumber(card.cardNumber);
          return card;
        });
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.maskCardNumber = function(cardNumber) {
      if (!cardNumber || cardNumber.length < 4) return '****-****-****-****';
      var last4 = cardNumber.substring(cardNumber.length - 4);
      return '****-****-****-' + last4;
    };
  }]);
})();