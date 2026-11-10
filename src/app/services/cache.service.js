(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CacheService', [function() {
      const cache = {};
      this.set = function(key, value, ttl) {
        cache[key] = {
          value: value,
          expiry: ttl ? Date.now() + ttl : null
        };
      };
      this.get = function(key) {
        const item = cache[key];
        if (!item) return null;
        if (item.expiry && Date.now() > item.expiry) {
          delete cache[key];
          return null;
        }
        return item.value;
      };
      this.clear = function(key) {
        if (key) {
          delete cache[key];
        } else {
          Object.keys(cache).forEach(k => delete cache[k]);
        }
      };
    }]);
})();