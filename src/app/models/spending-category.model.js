(function() {
  'use strict';
  angular.module('creditCardApp').factory('SpendingCategoryModel', [function() {
    function SpendingCategory(data) {
      this.categoryName = data.categoryName || '';
      this.totalAmount = data.totalAmount || 0;
      this.transactionCount = data.transactionCount || 0;
      this.percentage = data.percentage || 0;
    }
    
    SpendingCategory.prototype.getFormattedAmount = function() {
      return '$' + this.totalAmount.toFixed(2);
    };
    
    return SpendingCategory;
  }]);
})();