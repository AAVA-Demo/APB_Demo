(function() {
  'use strict';
  angular.module('app.dashboard').service('KPIService', ['$http', '$q', 'KPICalculatorFactory', KPIService]);
  function KPIService($http, $q, KPICalculatorFactory) {
    var vm = this;
    vm.getDashboardKPIs = getDashboardKPIs;
    function getDashboardKPIs() {
      var cardsPromise = $http.get('/api/cards');
      var transactionsPromise = $http.get('/api/transactions/monthly');
      return $q.all([cardsPromise, transactionsPromise]).then(function(results) {
        var cards = results[0].data;
        var transactions = results[1].data;
        return KPICalculatorFactory.calculateKPIs(cards, transactions);
      }).catch(function(error) {
        console.error('Error fetching dashboard KPIs:', error);
        return {
          monthlySpend: 0,
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          lastUpdated: new Date(),
          error: true
        };
      });
    }
  }
})();