(function() {
  'use strict';
  angular.module('dashboard')
    .service('AutoRefreshService', ['$interval', '$rootScope', function($interval, $rootScope) {
      var intervalPromise = null;
      this.start = function(callback, delay) {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
        }
        intervalPromise = $interval(callback, delay || 60000);
      };
      this.stop = function() {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
      };
    }]);
})();