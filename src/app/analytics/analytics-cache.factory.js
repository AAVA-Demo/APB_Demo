(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .factory('AnalyticsCacheFactory', ['$cacheFactory', function($cacheFactory) {
      var cache = $cacheFactory('analyticsCache', { capacity: 10 });
      return {
        get: function(key) {
          return cache.get(key);
        },
        put: function(key, value) {
          cache.put(key, value);
        },
        remove: function(key) {
          cache.remove(key);
        },
        removeAll: function() {
          cache.removeAll();
        }
      };
    }]);
})();