(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DateTimeService', [function() {
      var self = this;
      self.formatTimestamp = function(timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
      self.formatDate = function(timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };
      self.getLast12Months = function() {
        var end = new Date();
        var start = new Date();
        start.setMonth(start.getMonth() - 12);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
      };
    }]);
})();