(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CacheFactory', ['$cacheFactory', 'CACHE_CONFIG', function($cacheFactory, CACHE_CONFIG) {
      var cache = $cacheFactory('kpiCache');
      var timestamps = {};
      return {
        get: function(key) {
          var timestamp = timestamps[key];
          if (timestamp && (Date.now() - timestamp < CACHE_CONFIG.ttl)) {
            return cache.get(key);
          }
          cache.remove(key);
          delete timestamps[key];
          return null;
        },
        put: function(key, value) {
          timestamps[key] = Date.now();
          cache.put(key, value);
        },
        remove: function(key) {
          cache.remove(key);
          delete timestamps[key];
        }
      };
    }]);
})();