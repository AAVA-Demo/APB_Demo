(function() {
  'use strict';
  window.SpendingModel = class SpendingModel {
    constructor(data) {
      this.categories = data.categories || [];
      this.monthlyTrends = data.monthlyTrends || [];
      this.totalSpend = data.totalSpend || 0;
      this.period = data.period || 'Last 12 months';
      this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
    }
  };
})();