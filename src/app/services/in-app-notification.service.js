(function() {
  'use strict';
  angular.module('fraudAlertApp').service('inAppNotificationService', ['$rootScope', '$window', function($rootScope, $window) {
    this.displayAlert = (formattedAlert) => {
      $rootScope.$broadcast('fraud-alert-received', formattedAlert);
      toastr.warning(formattedAlert.message, formattedAlert.title, {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true,
        onclick: () => {
          $window.location.href = `#/alert/${formattedAlert.alert_id}`;
        }
      });
    };
  }]);
})();