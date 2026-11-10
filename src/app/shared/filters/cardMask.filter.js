(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('cardMask', function() {
      return function(cardNumber) {
        if (!cardNumber || cardNumber.length < 4) return '****';
        var last4 = cardNumber.slice(-4);
        return '**** **** **** ' + last4;
      };
    });
})();