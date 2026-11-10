(function() {
  'use strict';
  angular.module('app.dashboard').directive('autoRefresh', ['$interval', function($interval) {
    return {
      restrict: 'A',
      scope: {
        refreshFn: '&',
        interval: '@'
      },
      link: function(scope, element, attrs) {
        const intervalMs = parseInt(scope.interval) || 30000;
        const refreshInterval = $interval(function() {
          if (scope.refreshFn) {
            scope.refreshFn();
          }
        }, intervalMs);
        scope.$on('$destroy', function() {
          if (refreshInterval) {
            $interval.cancel(refreshInterval);
          }
        });
      }
    };
  }]);
})();