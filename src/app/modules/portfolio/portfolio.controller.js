(function() {
  'use strict';
  angular.module('creditCardPortfolioModule')
    .controller('CardPortfolioController', ['CardManagementFactory', 'AuthService', '$scope', function(CardManagementFactory, AuthService, $scope) {
      var vm = this;
      vm.cards = [];
      vm.portfolioSummary = {};
      vm.selectedCard = null;
      vm.init = function() {
        var userId = AuthService.getUserId();
        if (userId) {
          CardManagementFactory.getCardsByUserId(userId).then(function(cards) {
            vm.cards = cards;
            vm.computePortfolioSummary();
            $scope.$apply();
          });
        }
      };
      vm.computePortfolioSummary = function() {
        var totalCards = vm.cards.length;
        var totalCreditLimit = vm.cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
        var totalOutstanding = vm.cards.reduce(function(sum, card) { return sum + card.outstandingBalance; }, 0);
        var totalAvailableCredit = vm.cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
        vm.portfolioSummary = {
          totalCards: totalCards,
          totalCreditLimit: totalCreditLimit,
          totalOutstanding: totalOutstanding,
          totalAvailableCredit: totalAvailableCredit
        };
      };
      vm.viewCardDetails = function(cardId) {
        vm.selectedCard = vm.cards.find(function(card) { return card.cardId === cardId; });
      };
      vm.closeCardDetails = function() {
        vm.selectedCard = null;
      };
      vm.init();
    }]);
})();