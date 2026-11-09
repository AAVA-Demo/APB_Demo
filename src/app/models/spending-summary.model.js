(function() {
  'use strict';
  angular.module('creditCardApp').factory('SpendingSummary', [function() {
    function SpendingSummary(data) {
      this.categoryName = data.categoryName;
      this.totalAmount = data.totalAmount;
      this.transactionCount = data.transactionCount;
      this.percentage = data.percentage || 0;
    }
    return SpendingSummary;
  }]);
})();