(function() {
  'use strict';
  angular.module('creditCard.analytics').service('CategorizationService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var self = this;
    self.categorizeTransactions = function(transactions) {
      var deferred = $q.defer();
      setTimeout(function() {
        deferred.resolve(transactions);
      }, 200);
      return deferred.promise;
    };
  }]);
})();