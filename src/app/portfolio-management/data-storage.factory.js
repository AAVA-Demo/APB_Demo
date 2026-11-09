(function() {
  'use strict';
  angular.module('portfolioManagementModule')
    .factory('DataStorageFactory', ['$window', function($window) {
      var cache = {};
      return {
        cacheData: function(key, data) {
          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret-key').toString();
          cache[key] = encrypted;
          $window.sessionStorage.setItem(key, encrypted);
        },
        getCachedData: function(key) {
          var encrypted = cache[key] || $window.sessionStorage.getItem(key);
          if (encrypted) {
            try {
              var decrypted = CryptoJS.AES.decrypt(encrypted, 'secret-key').toString(CryptoJS.enc.Utf8);
              return JSON.parse(decrypted);
            } catch (e) {
              return null;
            }
          }
          return null;
        },
        clearCache: function() {
          cache = {};
          $window.sessionStorage.clear();
        }
      };
    }]);
})();