(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .service('cacheService', ['$cacheFactory', function($cacheFactory) {
      var cache = $cacheFactory('kpiCache');
      var self = this;
      self.get = function(key) {
        var item = cache.get(key);
        if (item && item.expiry > Date.now()) {
          return item.data;
        }
        cache.remove(key);
        return null;
      };
      self.put = function(key, data, ttlSeconds) {
        var item = {
          data: data,
          expiry: Date.now() + (ttlSeconds * 1000)
        };
        cache.put(key, item);
      };
    }]);
})();