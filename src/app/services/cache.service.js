(function() {
  'use strict';
  angular.module('creditCardApp').service('CacheService', ['$cacheFactory', function($cacheFactory) {
    var cache = $cacheFactory('dashboardCache');
    var TTL = 15 * 60 * 1000;
    this.get = function(key) {
      var item = cache.get(key);
      if (item && (Date.now() - item.timestamp < TTL)) {
        return item.data;
      }
      cache.remove(key);
      return null;
    };
    this.put = function(key, data) {
      cache.put(key, {data: data, timestamp: Date.now()});
    };
    this.remove = function(key) {
      cache.remove(key);
    };
  }]);
})();