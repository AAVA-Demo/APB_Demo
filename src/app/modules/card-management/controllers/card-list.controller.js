(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardListController', CardListController);
  CardListController.$inject = ['cardManagementService', '$scope', 'userProfileFactory', 'authFactory'];
  function CardListController(cardManagementService, $scope, userProfileFactory, authFactory) {
    var vm = this;
    vm.cards = [];
    vm.portfolio = null;
    vm.loading = true;
    vm.selectedCard = null;
    vm.init = function() {
      var userId = authFactory.getUserId();
      userProfileFactory.getUserCards({userId: userId}).$promise.then(function(cardIds) {
        return cardManagementService.loadCardPortfolio(cardIds);
      }).then(function(portfolio) {
        vm.portfolio = portfolio;
        vm.cards = portfolio.cards;
        vm.loading = false;
      }).catch(function() {
        vm.loading = false;
      });
    };
    vm.selectCard = function(card) {
      vm.selectedCard = card;
      cardManagementService.getCardAnalysis(card.cardId).then(function(analysis) {
        vm.selectedCard.analysis = analysis;
      });
    };
    vm.init();
  }
})();