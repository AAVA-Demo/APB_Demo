(function() {
  'use strict';
  angular.module('transactionModule')
    .service('DateUtilService', [DateUtilService]);

  function DateUtilService() {
    var service = {
      getDateDaysAgo: getDateDaysAgo,
      formatDate: formatDate,
      isValidDateRange: isValidDateRange
    };
    return service;

    function getDateDaysAgo(days) {
      var date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    }

    function formatDate(date) {
      if (!date) return '';
      var d = new Date(date);
      var month = '' + (d.getMonth() + 1);
      var day = '' + d.getDate();
      var year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }

    function isValidDateRange(startDate, endDate) {
      if (!startDate || !endDate) return false;
      return new Date(startDate) <= new Date(endDate);
    }
  }
})();