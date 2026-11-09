(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('autoRefresh', ['$interval', function($interval) {
      return {
        restrict: 'A',
        scope: {
          refreshFn: '&',
          interval: '='
        },
        link: function(scope, element, attrs) {
          var refreshInterval = $interval(function() {
            scope.refreshFn();
          }, scope.interval || 300000);
          scope.$on('$destroy', function() {
            $interval.cancel(refreshInterval);
          });
        }
      };
    }]);
})();