(function() {
  'use strict';
  angular.module('dashboardModule').service('DashboardKPIService', ['CreditCardDataFactory', 'TransactionProcessingFactory', '$q', function(CreditCardDataFactory, TransactionProcessingFactory, $q) {
    this.getKPIData = function() {
      return $q.all({
        cards: CreditCardDataFactory.getAllCards(),
        monthlySpend: TransactionProcessingFactory.getMonthlySpend()
      }).then(function(results) {
        const cards = results.cards;
        const monthlySpend = results.monthlySpend;
        let totalCreditLimit = 0;
        let totalAvailableCredit = 0;
        let totalOutstanding = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          totalAvailableCredit += card.availableCredit || 0;
          totalOutstanding += card.outstandingAmount || 0;
        });
        const kpis = [
          {
            label: 'Monthly Spend',
            value: monthlySpend.currentMonth || 0,
            currency: 'USD',
            icon: 'fa-shopping-cart',
            trend: monthlySpend.trend || 'neutral',
            trendValue: monthlySpend.currentMonth - monthlySpend.previousMonth || 0
          },
          {
            label: 'Total Credit Limit',
            value: totalCreditLimit,
            currency: 'USD',
            icon: 'fa-credit-card',
            trend: 'neutral',
            trendValue: 0
          },
          {
            label: 'Available Credit',
            value: totalAvailableCredit,
            currency: 'USD',
            icon: 'fa-check-circle',
            trend: 'neutral',
            trendValue: 0
          },
          {
            label: 'Outstanding Amount',
            value: totalOutstanding,
            currency: 'USD',
            icon: 'fa-exclamation-circle',
            trend: 'neutral',
            trendValue: 0
          }
        ];
        return {
          kpis: kpis,
          lastUpdated: new Date()
        };
      });
    };
  }]);
})();