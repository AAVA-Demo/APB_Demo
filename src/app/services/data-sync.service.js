(function() {
  'use strict';
  angular.module('cc.dashboard')
    .service('DataSyncService', ['DashboardService', DataSyncService]);
  function DataSyncService(DashboardService) {
    this.refreshKpis = function() {
      return DashboardService.loadKpis();
    };
  }
})();