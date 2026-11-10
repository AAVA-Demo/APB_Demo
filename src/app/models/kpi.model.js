(function() {
  'use strict';
  window.KpiModel = class KpiModel {
    constructor(data) {
      this.monthlySpend = data.monthlySpend || 0;
      this.totalCreditLimit = data.totalCreditLimit || 0;
      this.availableCredit = data.availableCredit || 0;
      this.outstandingAmount = data.outstandingAmount || 0;
      this.lastUpdated = data.lastUpdated || new Date();
    }
  };
})();