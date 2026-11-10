(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;

      self.getKPIs = function(userId) {
        var currentMonth = new Date().toISOString().slice(0, 7);
        var cardSummaryUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cardsSummary}?userId=${userId}`;
        var monthlyTransUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactionsMonthly}?userId=${userId}&month=${currentMonth}`;

        return $q.all([
          $http.get(cardSummaryUrl),
          $http.get(monthlyTransUrl)
        ]).then(function(responses) {
          var cards = responses[0].data;
          var transactions = responses[1].data;

          var totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
          var availableCredit = cards.reduce((sum, card) => sum + card.availableCredit, 0);
          var outstandingAmount = cards.reduce((sum, card) => sum + card.currentBalance, 0);
          var overallUtilization = totalCreditLimit > 0 ? (outstandingAmount / totalCreditLimit) * 100 : 0;

          return {
            userId: userId,
            month: currentMonth,
            monthlySpend: transactions.totalSpend || 0,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            overallUtilization: overallUtilization.toFixed(2),
            cardCount: cards.length,
            lastUpdated: new Date().toISOString()
          };
        });
      };
    }]);
})();