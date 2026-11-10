(function() {
  'use strict';
  angular.module('creditCardApp').service('CacheService', ['$cacheFactory', function($cacheFactory) {
    var cache = $cacheFactory('appCache');
    var ttlMap = {};
    this.get = function(key) {
      var entry = ttlMap[key];
      if (entry && entry.expiry > Date.now()) {
        return cache.get(key);
      } else {
        this.remove(key);
        return undefined;
      }
    };
    this.put = function(key, value, ttlSeconds) {
      cache.put(key, value);
      ttlMap[key] = {
        expiry: Date.now() + (ttlSeconds * 1000)
      };
    };
    this.remove = function(key) {
      cache.remove(key);
      delete ttlMap[key];
    };
    this.removeAll = function() {
      cache.removeAll();
      ttlMap = {};
    };
  }]);
})();