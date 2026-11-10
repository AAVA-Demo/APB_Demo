(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('currencyFormat', ['$filter', function($filter) {
      return function(amount) {
        return '$' + $filter('number')(amount, 2);
      };
    }]);
})();