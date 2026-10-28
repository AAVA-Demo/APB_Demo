(function() {
  'use strict';
  angular.module('fraudAlertApp').controller('alertDashboardController', ['$scope', '$interval', 'fraudDetectionService', 'alertService', function($scope, $interval, fraudDetectionService, alertService) {
    const vm = this;
    vm.alerts = [];
    vm.loading = false;
    vm.testTransaction = {
      transaction_id: 'TXN-' + Date.now(),
      account_id: 'ACC-12345',
      card_id: '4532123456789012',
      merchant: 'Test Merchant',
      amount: 150.00,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      channel: 'online',
      authorization_status: 'pending'
    };
    vm.loadAlerts = () => {
      vm.loading = true;
      alertService.getActiveAlerts()
        .then(alerts => {
          vm.alerts = alerts;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(error => {
          console.error('Failed to load alerts:', error);
          vm.loading = false;
          $scope.$apply();
        });
    };
    vm.processTestTransaction = () => {
      vm.testTransaction.transaction_id = 'TXN-' + Date.now();
      fraudDetectionService.processTransaction(vm.testTransaction)
        .then(result => {
          toastr.success('Transaction processed: ' + result.status, 'Success');
          vm.loadAlerts();
        })
        .catch(error => {
          toastr.error('Transaction processing failed', 'Error');
        });
    };
    vm.loadAlerts();
    const refreshInterval = $interval(() => {
      vm.loadAlerts();
    }, 30000);
    $scope.$on('$destroy', () => {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();