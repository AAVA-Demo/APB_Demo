(function() {
  'use strict';
  angular.module('creditCardApp').filter('currencyFormat', function() {
    return function(input, symbol) {
      if (input === null || input === undefined) return '';
      var formatted = parseFloat(input).toFixed(2);
      return (symbol || '$') + formatted;
    };
  });
})();