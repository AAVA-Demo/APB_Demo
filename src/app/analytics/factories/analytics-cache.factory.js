(function() {
  'use strict';
  angular.module('analyticsModule').factory('AnalyticsCache', AnalyticsCache);
  AnalyticsCache.$inject = ['$cacheFactory'];
  function AnalyticsCache($cacheFactory) {
    return $cacheFactory('analyticsCache', { capacity: 20 });
  }
})();