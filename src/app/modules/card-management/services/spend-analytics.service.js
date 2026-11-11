(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('SpendAnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getCardSpend = function(cardId) {
        return $http.get(API_CONFIG.baseUrl + '/cards/' + cardId + '/spend')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching card spend:', error);
            return $q.reject(error);
          });
      };
    }]);
})();