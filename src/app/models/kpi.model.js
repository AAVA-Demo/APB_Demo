(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPIModel', [function() {
      function KPIModel(data) {
        this.userId = data.userId || '';
        this.monthlySpend = data.monthlySpend || 0;
        this.totalCreditLimit = data.totalCreditLimit || 0;
        this.availableCredit = data.availableCredit || 0;
        this.outstandingAmount = data.outstandingAmount || 0;
        this.lastUpdated = data.lastUpdated || new Date();
      }
      return KPIModel;
    }]);
})();