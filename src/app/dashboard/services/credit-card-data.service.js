(function() {
  'use strict';
  angular.module('app.dashboard').service('CreditCardDataService', ['$http', '$q', function($http, $q) {
    var API_BASE = '/api';
    this.getCardSummary = function() {
      return $http.get(API_BASE + '/cards/summary').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.error('Card summary fetch error:', err);
        return $q.reject(err);
      });
    };
  }]);
})();