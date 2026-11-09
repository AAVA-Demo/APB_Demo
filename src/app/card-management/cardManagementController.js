(function() {
  'use strict';
  angular.module('creditCardApp').controller('cardManagementController', ['authService', 'cardDataService', 'cardMetadataService', 'spendAnalysisFactory', '$scope', function(authService, cardDataService, cardMetadataService, spendAnalysisFactory, $scope) {
    const vm = this;
    vm.cardPortfolio = null;
    vm.loading = true;
    vm.error = null;
    vm.showComparison = false;
    vm.comparisonData = [];
    vm.init = function() {
      loadCardData();
    };
    function loadCardData() {
      vm.loading = true;
      vm.error = null;
      authService.validateSession().then(function(token) {
        cardDataService.getCardList('user123').then(function(cards) {
          const cardIds = cards.map(c => c.cardId);
          cardMetadataService.getCardMetadata(cardIds).then(function(metadataArray) {
            const enrichedCards = cards.map(function(card, index) {
              return Object.assign({}, card, {metadata: metadataArray[index]});
            });
            const analyzedCards = spendAnalysisFactory.calculateSpendAnalysis(enrichedCards);
            vm.cardPortfolio = {
              userId: 'user123',
              cards: analyzedCards,
              totalCards: analyzedCards.length,
              lastSyncTime: new Date()
            };
            vm.loading = false;
            $scope.$apply();
          });
        }).catch(function(error) {
          console.error('Error loading card data:', error);
          vm.error = 'Failed to load card data. Please try again.';
          vm.loading = false;
          $scope.$apply();
        });
      });
    }
    vm.toggleComparison = function() {
      vm.showComparison = !vm.showComparison;
      if (vm.showComparison && vm.cardPortfolio) {
        vm.comparisonData = spendAnalysisFactory.compareCards(vm.cardPortfolio.cards);
      }
    };
    vm.init();
  }]);
})();