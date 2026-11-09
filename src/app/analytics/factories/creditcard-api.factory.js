(function() {
  'use strict';
  angular.module('app.analytics').factory('CreditCardAPIFactory', ['$http', '$q', function($http, $q) {
    var baseUrl = '/api/cards';
    return {
      getCards: function(userId) {
        return $http.get(baseUrl + '?userId=' + userId).then(function(response) {
          return response.data;
        }).catch(function(err) {
          return $q.reject(err);
        });
      }
    };
  }]);
})();