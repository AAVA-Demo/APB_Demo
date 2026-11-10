(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('NotificationService', [function() {
      this.success = function(message) {
        alert('SUCCESS: ' + message);
      };
      this.error = function(message) {
        alert('ERROR: ' + message);
      };
      this.info = function(message) {
        alert('INFO: ' + message);
      };
    }]);
})();