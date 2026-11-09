(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('NotificationService', ['$timeout', NotificationService]);

  function NotificationService($timeout) {
    var service = {
      success: success,
      error: error,
      info: info,
      warning: warning
    };
    return service;

    function success(message) {
      showNotification(message, 'success');
    }

    function error(message) {
      showNotification(message, 'danger');
    }

    function info(message) {
      showNotification(message, 'info');
    }

    function warning(message) {
      showNotification(message, 'warning');
    }

    function showNotification(message, type) {
      var notification = document.createElement('div');
      notification.className = 'alert alert-' + type + ' alert-dismissible';
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.zIndex = '9999';
      notification.style.minWidth = '300px';
      notification.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button>' + message;
      
      document.body.appendChild(notification);
      
      $timeout(function() {
        notification.remove();
      }, 5000);
    }
  }
})();