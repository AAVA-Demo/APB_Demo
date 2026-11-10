(function() {
  'use strict';
  angular.module('analyticsModule').factory('FilterFactory', [function() {
    return {
      createDateRange: function(months) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return { start: start, end: end };
      },
      getDefaultFilters: function() {
        return {
          dateRange: this.createDateRange(12),
          cardIds: [],
          categories: []
        };
      }
    };
  }]);
})();