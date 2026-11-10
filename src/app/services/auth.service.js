(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$window', '$q', function($window, $q) {
    var service = this;
    var mockUserId = 'user123';

    service.validateUser = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(mockUserId);
        }, 100);
      });
    };
  }]);
})();