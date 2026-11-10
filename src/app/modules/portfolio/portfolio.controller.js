(function() {
  'use strict';
  angular.module('app.portfolio').controller('PortfolioController', ['$scope', '$q', 'AuthService', 'CardRepositoryService', 'TransactionService', 'CardMetricsFactory', function($scope, $q, AuthService, CardRepositoryService, TransactionService, CardMetricsFactory) {
    var vm = this;
    vm.cards = [];
    vm.cardMetrics = {};
    vm.selectedCard = null;
    vm.loading = true;
    vm.error = null;
    vm.showAddCardModal = false;
    vm.newCard = {};

    function loadPortfolio() {
      vm.loading = true;
      vm.error = null;
      AuthService.validateUser().then(function(userId) {
        return CardRepositoryService.getUserCards(userId);
      }).then(function(cards) {
        vm.cards = cards;
        var metricsPromises = cards.map(function(card) {
          return TransactionService.getCardTransactions(card.cardId).then(function(transactions) {
            vm.cardMetrics[card.cardId] = CardMetricsFactory.calculate(card, transactions);
          });
        });
        return $q.all(metricsPromises);
      }).then(function() {
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.error = 'Failed to load portfolio data. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }

    vm.selectCard = function(card) {
      vm.selectedCard = card;
    };

    vm.openAddCardModal = function() {
      vm.showAddCardModal = true;
      vm.newCard = {};
    };

    vm.closeAddCardModal = function() {
      vm.showAddCardModal = false;
      vm.newCard = {};
    };

    vm.addCard = function() {
      if (vm.addCardForm.$valid) {
        AuthService.validateUser().then(function(userId) {
          vm.newCard.userId = userId;
          return CardRepositoryService.addCard(vm.newCard);
        }).then(function() {
          vm.closeAddCardModal();
          loadPortfolio();
        }).catch(function(error) {
          vm.error = 'Failed to add card. Please try again.';
          $scope.$apply();
        });
      }
    };

    vm.$onInit = function() {
      loadPortfolio();
    };
  }]);
})();