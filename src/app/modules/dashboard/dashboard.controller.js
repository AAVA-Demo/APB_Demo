(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', 'CreditCardService', 'KPICalculatorFactory', function($scope, CreditCardService, KPICalculatorFactory) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.cards = [];
      vm.kpis = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0,
        totalMonthlySpend: 0
      };
      vm.init = function() {
        CreditCardService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.kpis = KPICalculatorFactory.calculateKPIs(cards);
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit card data. Please try again.';
            vm.loading = false;
            console.error('Error loading cards:', error);
            $scope.$apply();
          });
      };
      vm.formatCurrency = function(amount) {
        return '$' + (amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.maskCardNumber = function(cardNumber) {
        if (!cardNumber) return '';
        return '**** **** **** ' + cardNumber.slice(-4);
      };
      vm.getUtilizationPercentage = function(card) {
        if (!card.creditLimit || card.creditLimit === 0) return 0;
        return ((card.creditLimit - card.availableCredit) / card.creditLimit * 100).toFixed(1);
      };
      vm.init();
    }]);
})();