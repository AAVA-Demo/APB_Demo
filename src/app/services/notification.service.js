(function() {
  'use strict';
  angular.module('creditCardApp').service('NotificationService', NotificationService);
  NotificationService.$inject = [];
  function NotificationService() {
    var vm = this;
    vm.show = function(message, type) {
      alert(message);
    };
    vm.error = function(message) {
      vm.show(message, 'error');
    };
    vm.success = function(message) {
      vm.show(message, 'success');
    };
  }
})();