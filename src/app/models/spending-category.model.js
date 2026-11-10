(function() {
  'use strict';
  window.SpendingCategoryModel = class SpendingCategoryModel {
    constructor(data) {
      this.category = data.category || '';
      this.amount = data.amount || 0;
      this.percentage = data.percentage || 0;
      this.transactionCount = data.transactionCount || 0;
    }
  };
})();