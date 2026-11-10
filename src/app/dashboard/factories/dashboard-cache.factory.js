(function() {
  'use strict';
  angular.module('dashboardModule').factory('DashboardCache', DashboardCache);
  DashboardCache.$inject = ['$cacheFactory'];
  function DashboardCache($cacheFactory) {
    return $cacheFactory('dashboardCache', { capacity: 10 });
  }
})();