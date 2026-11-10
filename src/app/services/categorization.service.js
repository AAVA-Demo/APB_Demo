(function() {
  'use strict';
  angular.module('creditCardApp').service('CategorizationService', ['$http', '$q', function($http, $q) {
    var service = this;

    service.categorize = function(transactions) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          transactions.forEach(function(t) {
            if (!t.category) {
              t.category = 'Miscellaneous';
            }
          });
          resolve(transactions);
        }, 200);
      });
    };
  }]);
})();