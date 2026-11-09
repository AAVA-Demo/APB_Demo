(function() {
  'use strict';
  angular.module('app.cardManagement')
    .filter('cardMask', function() {
      return function(cardNumber) {
        if (!cardNumber) return '';
        var str = cardNumber.toString();
        if (str.length < 4) return str;
        var last4 = str.slice(-4);
        var masked = '**** **** **** ' + last4;
        return masked;
      };
    });
})();