(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('DateFilterFactory', [function() {
      return {
        validateDateRange: function(startDate, endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          return monthsDiff >= 0 && monthsDiff <= 12;
        },
        formatDateForAPI: function(date) {
          if (!date) return null;
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        },
        getDefaultDateRange: function() {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 12);
          return {
            startDate: this.formatDateForAPI(start),
            endDate: this.formatDateForAPI(end)
          };
        }
      };
    }]);
})();