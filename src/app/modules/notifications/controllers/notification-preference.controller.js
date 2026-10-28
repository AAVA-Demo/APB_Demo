(function() {
  'use strict';
  angular.module('fraudAlertApp').controller('notificationPreferenceController', ['$scope', 'customerProfileService', function($scope, customerProfileService) {
    const vm = this;
    vm.preferences = null;
    vm.loading = true;
    vm.customerId = localStorage.getItem('customer_id') || 'CUST-12345';
    vm.loadPreferences = () => {
      customerProfileService.getNotificationPreferences(vm.customerId)
        .then(preferences => {
          vm.preferences = preferences;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(error => {
          console.error('Failed to load preferences:', error);
          vm.loading = false;
          $scope.$apply();
        });
    };
    vm.savePreferences = () => {
      customerProfileService.updateNotificationPreferences(vm.customerId, vm.preferences)
        .then(() => {
          toastr.success('Notification preferences updated', 'Success');
        })
        .catch(error => {
          toastr.error('Failed to update preferences', 'Error');
        });
    };
    vm.loadPreferences();
  }]);
})();