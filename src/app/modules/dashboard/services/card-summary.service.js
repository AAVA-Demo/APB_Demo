(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('CardSummaryService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getCardSummaries = function() {
        return $http.get(API_CONFIG.baseUrl + '/cards/summary')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching card summaries:', error);
            return $q.reject(error);
          });
      };
    }]);
})();