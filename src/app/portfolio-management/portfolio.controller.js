(function() {
  'use strict';
  angular.module('portfolioManagementModule')
    .controller('PortfolioController', ['$scope', 'CardManagementService', 'UserService', function($scope, CardManagementService, UserService) {
      var vm = this;
      vm.cards = [];
      vm.portfolioSummary = {};
      vm.loading = true;
      vm.error = null;
      function loadPortfolio() {
        vm.loading = true;
        UserService.getUserId();
        CardManagementService.getCards().then(function(cards) {
          vm.cards = cards;
          vm.portfolioSummary = calculateSummary(cards);
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load portfolio.';
          vm.loading = false;
        });
      }
      function calculateSummary(cards) {
        var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
        var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
        var totalOutstanding = cards.reduce(function(sum, card) { return sum + card.currentBalance; }, 0);
        var avgUtilization = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(1) : 0;
        return {
          totalCards: cards.length,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          averageUtilization: avgUtilization
        };
      }
      vm.selectCard = function(card) {
        console.log('Card selected:', card.cardId);
      };
      loadPortfolio();
    }]);
})();