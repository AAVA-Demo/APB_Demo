(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardAnalyticsService', ['$http', '$q', function($http, $q) {
      this.getCardAnalytics = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/analytics')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching card analytics:', error);
            return $q.reject(error);
          });
      };
    }]);
})();