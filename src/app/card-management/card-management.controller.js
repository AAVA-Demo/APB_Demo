(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardManagementController', ['$scope', 'CardApiService', function($scope, CardApiService) {
      const vm = this;
      vm.cards = [];
      vm.filteredCards = [];
      vm.loading = true;
      vm.error = null;
      vm.statusFilter = 'all';
      vm.selectedCard = null;
      vm.init = function() {
        CardApiService.fetchAllCards().then(function(cards) {
          vm.cards = cards;
          vm.filteredCards = cards;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load credit cards';
          vm.loading = false;
        });
      };
      vm.filterByStatus = function(status) {
        vm.statusFilter = status;
        if (status === 'all') {
          vm.filteredCards = vm.cards;
        } else {
          vm.filteredCards = vm.cards.filter(function(card) {
            return card.status === status;
          });
        }
      };
      vm.showCardDetails = function(card) {
        vm.selectedCard = card;
      };
      vm.closeDetails = function() {
        vm.selectedCard = null;
      };
      vm.init();
    }]);
})();