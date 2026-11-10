(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('ReportingService', [function() {
      this.generateReport = function(format, data) {
        if (format === 'CSV') {
          let csv = 'Category,Amount,Percentage\n';
          data.categoryBreakdown.forEach(function(item) {
            csv += item.category + ',' + item.amount + ',' + item.percentage + '%\n';
          });
          csv += '\nMonth,Total Spend\n';
          data.monthlyTrends.forEach(function(item) {
            csv += item.month + ',' + item.totalSpend + '\n';
          });
          const blob = new Blob([csv], {type: 'text/csv'});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'analytics_report.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      };
    }]);
})();