(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var categories = [
        'Food & Dining',
        'Fuel',
        'Shopping',
        'Travel',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Education',
        'Miscellaneous'
      ];
      return {
        getCategoryMapping: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            deferred.resolve({data: categories});
          }, 200);
          return deferred.promise;
        }
      };
    }]);
})();