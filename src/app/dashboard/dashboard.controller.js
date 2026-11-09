(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardDataFactory', 'KPICalculationService', function($scope, $interval, CreditCardDataFactory, KPICalculationService) {
      const vm = this;
      vm.kpis = {};
      vm.loading = true;
      function loadKPIs() {
        vm.loading = true;
        CreditCardDataFactory.getCardData().then(function(cardData) {
          vm.kpis = KPICalculationService.calculateKPIs(cardData);
          vm.loading = false;
        }).catch(function(error) {
          console.error('Error loading KPIs:', error);
          vm.loading = false;
        });
      }
      loadKPIs();
      const refreshInterval = $interval(loadKPIs, 300000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }]);
})();