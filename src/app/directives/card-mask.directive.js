(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardMask', [function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          var text = element.text();
          if (text && text.length > 4) {
            var masked = '**** **** **** ' + text.slice(-4);
            element.text(masked);
          }
        }
      };
    }]);
})();