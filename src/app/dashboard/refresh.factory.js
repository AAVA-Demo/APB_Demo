(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('RefreshFactory', ['$interval', '$rootScope', function($interval, $rootScope) {
      var intervalPromise = null;
      
      return {
        startPolling: function(interval, callback) {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
          }
          intervalPromise = $interval(function() {
            if (callback) {
              callback();
            }
            $rootScope.$broadcast('dataRefreshed');
          }, interval);
        },
        stopPolling: function() {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
            intervalPromise = null;
          }
        }
      };
    }]);
})();