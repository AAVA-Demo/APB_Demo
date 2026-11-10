(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', function($window) {
      var vm = this;
      vm.currentUser = null;
      vm.initSession = function() {
        var storedUser = $window.localStorage.getItem('currentUser');
        if (storedUser) {
          vm.currentUser = JSON.parse(storedUser);
        } else {
          vm.currentUser = { userId: 'user123', name: 'Demo User' };
          $window.localStorage.setItem('currentUser', JSON.stringify(vm.currentUser));
        }
      };
      vm.getCurrentUser = function() {
        return vm.currentUser;
      };
      vm.getUserId = function() {
        return vm.currentUser ? vm.currentUser.userId : null;
      };
    }]);
})();