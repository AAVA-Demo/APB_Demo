(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .directive('responsiveLayout', ['$window', responsiveLayout]);

  function responsiveLayout($window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function() {
          return {
            'h': w.height(),
            'w': w.width()
          };
        };
        scope.$watch(scope.getWindowDimensions, function(newValue) {
          scope.windowHeight = newValue.h;
          scope.windowWidth = newValue.w;
          if (newValue.w < 768) {
            element.addClass('mobile-view');
          } else {
            element.removeClass('mobile-view');
          }
        }, true);
        w.bind('resize', function() {
          scope.$apply();
        });
      }
    };
  }
})();