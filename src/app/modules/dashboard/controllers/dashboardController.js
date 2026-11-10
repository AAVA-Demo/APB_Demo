(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['CardService', 'KPIService', 'RefreshFactory', '$scope', '$interval', function(CardService, KPIService, RefreshFactory, $scope, $interval) {
    var vm = this;
    vm.cards = [];
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    var refreshInterval;
    
    function loadDashboard() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      CardService.getUserCards(userId).then(function(cards) {
        vm.cards = cards;
        vm.kpis = KPIService.calculateKPIs(cards);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    }
    
    function startAutoRefresh() {
      refreshInterval = RefreshFactory.startRefresh(loadDashboard, 300000);
    }
    
    loadDashboard();
    startAutoRefresh();
    
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();