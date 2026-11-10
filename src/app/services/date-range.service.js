(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DateRangeService', [function() {
      this.getLast12Months = function() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        return { startDate: startDate, endDate: endDate };
      };
      this.getCurrentMonth = function() {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: startDate, endDate: endDate };
      };
      this.formatDate = function(date) {
        return date.toISOString().split('T')[0];
      };
    }]);
})();