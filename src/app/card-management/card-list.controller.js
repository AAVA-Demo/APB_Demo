(function() {
  'use strict';
  angular.module('creditCardManagementModule').controller('CardListController', ['CardManagementService', '$scope', '$location', function(CardManagementService, $scope, $location) {
    var vm = this;
    vm.cards = [];
    vm.filteredCards = [];
    vm.loading = true;
    vm.error = null;
    vm.searchText = '';
    vm.loadCards = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.filteredCards = cards;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load credit cards. Please try again.';
        vm.loading = false;
      });
    };
    vm.filterCards = function() {
      if (!vm.searchText) {
        vm.filteredCards = vm.cards;
      } else {
        var search = vm.searchText.toLowerCase();
        vm.filteredCards = vm.cards.filter(function(card) {
          return card.cardHolderName.toLowerCase().indexOf(search) > -1 ||
                 card.cardType.toLowerCase().indexOf(search) > -1 ||
                 card.cardNumber.indexOf(search) > -1;
        });
      }
    };
    vm.viewCardDetail = function(cardId) {
      $location.path('/cards/' + cardId);
    };
    vm.loadCards();
  }]);
})();