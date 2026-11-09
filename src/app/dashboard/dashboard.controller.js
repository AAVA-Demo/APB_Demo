(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .controller('DashboardController', ['KPICalculationService', 'AuthService', 'RealtimeRefreshFactory', '$scope', function(KPICalculationService, AuthService, RealtimeRefreshFactory, $scope) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      var refreshPromise;

      function init() {
        AuthService.validateSession().then(function(session) {
          loadKPIs(session.userId);
          refreshPromise = RealtimeRefreshFactory.startPolling(function() {
            loadKPIs(session.userId);
          }, 60000);
        });
      }

      function loadKPIs(userId) {
        KPICalculationService.calculateKPIs(userId).then(function(kpis) {
          vm.kpis = kpis;
          vm.loading = false;
          $scope.$apply();
        });
      }

      $scope.$on('$destroy', function() {
        RealtimeRefreshFactory.stopPolling(refreshPromise);
      });

      init();
    }]);
})();