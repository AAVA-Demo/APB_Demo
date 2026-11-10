(function() {
  'use strict';
  angular.module('creditCardApp.responsive')
    .directive('responsiveContainer', ['$window', 'ResponsiveUtilsService', function($window, ResponsiveUtilsService) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          function applyResponsiveStyles() {
            var width = $window.innerWidth;
            var breakpoint = ResponsiveUtilsService.getBreakpoint(width);
            element.removeClass('bp-xs bp-sm bp-md bp-lg bp-xl');
            element.addClass('bp-' + breakpoint);
          }
          applyResponsiveStyles();
          angular.element($window).on('resize', function() {
            applyResponsiveStyles();
            scope.$apply();
          });
          scope.$on('$destroy', function() {
            angular.element($window).off('resize');
          });
        }
      };
    }]);
})();