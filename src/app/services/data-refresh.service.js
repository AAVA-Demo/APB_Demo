(function() {
  'use strict';
  angular.module('creditCardApp').service('DataRefreshService', ['$interval', '$rootScope', DataRefreshService]);
  function DataRefreshService($interval, $rootScope) {
    var vm = this;
    vm.startPolling = startPolling;
    vm.stopPolling = stopPolling;
    var pollingPromise = null;
    function startPolling(callback, intervalMs) {
      intervalMs = intervalMs || 30000;
      if (pollingPromise) {
        $interval.cancel(pollingPromise);
      }
      pollingPromise = $interval(function() {
        callback();
      }, intervalMs);
      return pollingPromise;
    }
    function stopPolling() {
      if (pollingPromise) {
        $interval.cancel(pollingPromise);
        pollingPromise = null;
      }
    }
  }
})();