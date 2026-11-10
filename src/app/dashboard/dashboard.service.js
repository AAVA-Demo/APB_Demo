(function() {
  'use strict';
  angular.module('dashboardModule').service('DashboardService', DashboardService);
  DashboardService.$inject = ['CreditCardDataFactory', 'KPIFactory', '$q', '$cacheFactory'];
  function DashboardService(CreditCardDataFactory, KPIFactory, $q, $cacheFactory) {
    var vm = this;
    var cache = $cacheFactory('dashboardCache');
    vm.loadDashboard = loadDashboard;
    vm.refreshKPIs = refreshKPIs;
    function loadDashboard() {
      var cachedData = cache.get('dashboardData');
      if (cachedData) {
        return $q.resolve(cachedData);
      }
      return $q.all({
        cards: CreditCardDataFactory.fetchAllCards(),
        kpis: KPIFactory.fetchKPIs()
      }).then(function(results) {
        var dashboardData = {
          cards: results.cards,
          totalCreditLimit: results.kpis.totalCreditLimit,
          totalOutstandingAmount: results.kpis.totalOutstandingAmount,
          totalAvailableCredit: results.kpis.totalAvailableCredit,
          totalMonthlySpend: results.kpis.totalMonthlySpend
        };
        cache.put('dashboardData', dashboardData);
        setTimeout(function() {
          cache.remove('dashboardData');
        }, 300000);
        return dashboardData;
      });
    }
    function refreshKPIs() {
      return KPIFactory.fetchKPIs();
    }
  }
})();