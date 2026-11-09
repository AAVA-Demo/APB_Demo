(function() {
  'use strict';
  angular.module('creditCardApp').service('dataRefreshService', ['$interval', function($interval) {
    var intervals = [];
    this.startRefresh = function(callback, delay) {
      var intervalPromise = $interval(callback, delay);
      intervals.push(intervalPromise);
      return intervalPromise;
    };
    this.stopRefresh = function(intervalPromise) {
      $interval.cancel(intervalPromise);
      var index = intervals.indexOf(intervalPromise);
      if (index > -1) {
        intervals.splice(index, 1);
      }
    };
    this.stopAll = function() {
      intervals.forEach(function(intervalPromise) {
        $interval.cancel(intervalPromise);
      });
      intervals = [];
    };
  }]);
})();