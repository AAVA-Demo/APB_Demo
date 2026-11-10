(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('TransactionDataFactory', [function() {
      let cachedData = null;
      return {
        setData: function(data) {
          cachedData = data;
        },
        getData: function() {
          return cachedData;
        },
        clearCache: function() {
          cachedData = null;
        }
      };
    }]);
})();