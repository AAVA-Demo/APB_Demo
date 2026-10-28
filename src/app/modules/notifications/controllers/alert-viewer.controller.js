(function() {
  'use strict';
  angular.module('fraudAlertApp').controller('alertViewerController', ['$scope', '$routeParams', '$location', 'alertService', function($scope, $routeParams, $location, alertService) {
    const vm = this;
    vm.alert = null;
    vm.loading = true;
    vm.alertId = $routeParams.alertId;
    vm.loadAlert = () => {
      alertService.getAlert(vm.alertId)
        .then(alert => {
          vm.alert = alert;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(error => {
          console.error('Failed to load alert:', error);
          toastr.error('Failed to load alert details', 'Error');
          vm.loading = false;
          $scope.$apply();
        });
    };
    vm.confirmTransaction = () => {
      toastr.success('Transaction confirmed as legitimate', 'Confirmed');
      $location.path('/dashboard');
    };
    vm.reportTransaction = () => {
      toastr.warning('Transaction reported as fraud. Account protection initiated.', 'Reported');
      $location.path('/dashboard');
    };
    vm.loadAlert();
  }]);
})();