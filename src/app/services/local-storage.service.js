(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('LocalStorageService', [function() {
      this.set = function(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error('LocalStorage set error:', e);
        }
      };
      this.get = function(key) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.error('LocalStorage get error:', e);
          return null;
        }
      };
      this.remove = function(key) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error('LocalStorage remove error:', e);
        }
      };
    }]);
})();