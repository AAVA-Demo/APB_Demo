(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('RefreshService', ['$interval', 'API_CONFIG', function($interval, API_CONFIG) {
      var self = this;
      var intervalPromise = null;

      self.start = function(callback) {
        if (intervalPromise) {
          self.stop();
        }
        intervalPromise = $interval(callback, API_CONFIG.refreshInterval);
      };

      self.stop = function() {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
      };
    }]);
})();