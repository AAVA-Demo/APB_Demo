(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['CardPortfolioService', 'SpendAnalysisService', function(CardPortfolioService, SpendAnalysisService) {
      const vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.selectCard = function(card) {
        vm.selectedCard = card;
        vm.selectedCard.utilization = SpendAnalysisService.calculateUtilization(card);
        SpendAnalysisService.getMonthlyTrends(card.cardId).then(function(trends) {
          vm.monthlyTrends = trends;
        });
      };
      CardPortfolioService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
        if (cards.length > 0) {
          vm.selectCard(cards[0]);
        }
      }).catch(function(error) {
        console.error('Error loading cards:', error);
        vm.loading = false;
      });
    }]);
})();