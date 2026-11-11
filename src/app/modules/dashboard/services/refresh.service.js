(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('RefreshService', ['$interval', '$rootScope', function($interval, $rootScope) {
      var self = this;
      var intervalPromise = null;
      self.startRefresh = function(callback, interval) {
        interval = interval || 60000;
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
        }
        intervalPromise = $interval(callback, interval);
        return intervalPromise;
      };
      self.stopRefresh = function() {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
      };
    }]);
})();