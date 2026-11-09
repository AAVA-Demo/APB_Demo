(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('cardNumberMask', [function() {
      return function(cardNumber) {
        if (!cardNumber) return '****';
        var last4 = cardNumber.slice(-4);
        return '**** **** **** ' + last4;
      };
    }]);
})();