(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CacheFactory', ['$cacheFactory', function($cacheFactory) {
      var cache = $cacheFactory('appCache');
      return {
        get: function(key) {
          var cached = cache.get(key);
          if (cached && cached.expiry > Date.now()) {
            return cached.data;
          }
          cache.remove(key);
          return null;
        },
        put: function(key, data, ttlSeconds) {
          cache.put(key, {
            data: data,
            expiry: Date.now() + (ttlSeconds * 1000)
          });
        },
        remove: function(key) {
          cache.remove(key);
        }
      };
    }]);
})();