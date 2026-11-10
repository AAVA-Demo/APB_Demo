(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DateRangeService', ['$filter', function($filter) {
      this.getLast12Months = function() {
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        return { startDate: startDate, endDate: endDate };
      };
      this.formatMonth = function(dateString) {
        return $filter('date')(new Date(dateString), 'MMM yyyy');
      };
    }]);
})();