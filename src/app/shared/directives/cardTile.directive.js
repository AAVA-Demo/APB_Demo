(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardTile', function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        templateUrl: 'src/app/shared/directives/cardTile.template.html'
      };
    });
})();