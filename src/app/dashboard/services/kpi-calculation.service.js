(function() {
  'use strict';
  angular.module('dashboardModule').service('KPICalculationService', KPICalculationService);
  KPICalculationService.$inject = [];
  function KPICalculationService() {
    var vm = this;
    vm.formatKPIs = function(data) {
      return {
        monthlySpend: vm.formatCurrency(data.monthlySpend),
        totalCreditLimit: vm.formatCurrency(data.totalCreditLimit),
        availableCredit: vm.formatCurrency(data.availableCredit),
        outstandingAmount: vm.formatCurrency(data.outstandingAmount),
        utilizationPercentage: vm.formatPercentage(data.utilizationPercentage),
        lastUpdated: new Date(data.lastUpdated)
      };
    };
    vm.formatCurrency = function(amount) {
      return '$' + (amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
    vm.formatPercentage = function(value) {
      return (value || 0).toFixed(1) + '%';
    };
    vm.getUtilizationClass = function(percentage) {
      if (percentage < 30) return 'utilization-low';
      if (percentage < 70) return 'utilization-medium';
      return 'utilization-high';
    };
  }
})();