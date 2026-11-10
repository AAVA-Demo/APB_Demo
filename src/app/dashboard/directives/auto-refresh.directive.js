(function() {
  'use strict';
  angular.module('dashboard')
    .directive('autoRefresh', ['$interval', 'DashboardService', function($interval, DashboardService) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var intervalTime = parseInt(attrs.autoRefresh) || 30000;
          var refreshInterval = $interval(function() {
            scope.$emit('refresh-data');
          }, intervalTime);
          scope.$on('$destroy', function() {
            if (refreshInterval) {
              $interval.cancel(refreshInterval);
            }
          });
        }
      };
    }]);
})();