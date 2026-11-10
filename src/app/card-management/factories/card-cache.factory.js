(function() {
  'use strict';
  angular.module('app.cardManagement').factory('CardCacheFactory', [function() {
    var cache = new Map();
    var TTL = 300000;
    return {
      set: function(key, value) {
        cache.set(key, {
          value: value,
          timestamp: Date.now()
        });
      },
      get: function(key) {
        var entry = cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > TTL) {
          cache.delete(key);
          return null;
        }
        return entry.value;
      },
      clear: function() {
        cache.clear();
      }
    };
  }]);
})();