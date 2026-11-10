(function() {
  'use strict';
  angular.module('app.portfolio')
    .service('PortfolioService', ['$http', 'KpiCalculator', 'ApiService', function($http, KpiCalculator, ApiService) {
      var self = this;
      this.loadPortfolio = function() {
        return ApiService.get('/cards').then(function(cards) {
          var kpis = KpiCalculator.calculateKpis(cards);
          return { cards: cards, kpis: kpis };
        });
      };
    }]);
  PortfolioService.$inject = ['$http', 'KpiCalculator', 'ApiService'];
})();