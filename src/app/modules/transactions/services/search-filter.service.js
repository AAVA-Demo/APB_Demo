(function() {
  'use strict';
  angular.module('app.transactions')
    .service('SearchFilterService', ['$filter', function($filter) {
      var self = this;
      self.buildFilterParams = function(filters) {
        var params = {};
        if (filters.cardId) {
          params.cardId = filters.cardId;
        }
        if (filters.startDate) {
          params.startDate = moment(filters.startDate).format('YYYY-MM-DD');
        }
        if (filters.endDate) {
          params.endDate = moment(filters.endDate).format('YYYY-MM-DD');
        }
        if (filters.keyword) {
          params.keyword = filters.keyword;
        }
        if (filters.category) {
          params.category = filters.category;
        }
        return params;
      };
    }]);
})();