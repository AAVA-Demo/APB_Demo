angular.module('fraudAlertApp').controller('FraudAlertsController', ['FraudAlertService', function(FraudAlertService) {
  var vm = this;
  vm.alerts = [];
  vm.selectedAlert = null;
  vm.isLoading = true;
  vm.message = '';

  function loadAlerts() {
    vm.isLoading = true;
    FraudAlertService.getAlerts().then(function(response) {
      vm.alerts = response.data;
      vm.isLoading = false;
    }).catch(function() {
      vm.message = 'Failed to load alerts.';
      vm.isLoading = false;
    });
  }

  vm.viewDetails = function(alert) {
    vm.selectedAlert = angular.copy(alert);
  };

  vm.confirm = function(alert) {
    FraudAlertService.confirmTransaction(alert.alert_id).then(function() {
      var originalAlert = vm.alerts.find(function(a) { return a.alert_id === alert.alert_id; });
      if (originalAlert) {
        originalAlert.status = 'Confirmed';
      }
      vm.message = 'Transaction ' + alert.transaction_id + ' confirmed.';
      vm.closeDetails();
    });
  };

  vm.report = function(alert) {
    FraudAlertService.reportTransaction(alert.alert_id).then(function() {
      var originalAlert = vm.alerts.find(function(a) { return a.alert_id === alert.alert_id; });
      if (originalAlert) {
        originalAlert.status = 'Reported';
      }
      vm.message = 'Transaction ' + alert.transaction_id + ' reported. Your account will be secured.';
      vm.closeDetails();
    });
  };

  vm.closeDetails = function() {
    vm.selectedAlert = null;
  };

  loadAlerts();
}]);