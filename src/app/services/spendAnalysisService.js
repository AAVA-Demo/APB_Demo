(function() {
  'use strict';
  angular.module('creditCardApp').service('spendAnalysisService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getSpendSummary = function(cardId) {
      return $http.get('/api/cards/' + cardId + '/spend').then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getCardSpendTrends = function(cardId, startDate, endDate) {
      return $http.get('/api/cards/' + cardId + '/spend/trends', {
        params: { start: startDate, end: endDate }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();