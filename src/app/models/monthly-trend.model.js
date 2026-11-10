(function() {
  'use strict';
  window.MonthlyTrendModel = class MonthlyTrendModel {
    constructor(data) {
      this.month = data.month || '';
      this.totalSpend = data.totalSpend || 0;
    }
  };
})();