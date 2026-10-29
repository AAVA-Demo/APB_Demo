angular.module('fraudAlertApp').controller('AlertListController', ['AlertService', function(AlertService) {
  var vm = this;
  vm.alerts = [];
  vm.confirm = confirm;
  vm.report = report;

  function activate() {
    vm.alerts = AlertService.getAlerts();
  }

  function confirm(alertId) {
    var alert = vm.alerts.find(function(a) { return a.alert_id === alertId; });
    if (alert) {
      alert.status = 'Confirmed';
      console.log('Confirmed transaction:', alert.transaction_id);
    }
  }

  function report(alertId) {
    var alert = vm.alerts.find(function(a) { return a.alert_id === alertId; });
    if (alert) {
      alert.status = 'Reported';
      console.log('Reported transaction:', alert.transaction_id);
    }
  }

  activate();
}]);