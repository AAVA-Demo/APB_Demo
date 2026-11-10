(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['$scope', '$location', 'CardService', 'AuthFactory', function($scope, $location, CardService, AuthFactory) {
      var vm = this;
      vm.cards = [];
      vm.filteredCards = [];
      vm.loading = true;
      vm.error = null;
      vm.searchText = '';
      vm.statusFilter = 'All';
      function loadCards() {
        vm.loading = true;
        CardService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.filteredCards = cards;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load cards';
            vm.loading = false;
            $scope.$apply();
          });
      }
      vm.applyFilter = function() {
        vm.filteredCards = vm.cards.filter(function(card) {
          var matchesSearch = !vm.searchText || card.cardNumber.includes(vm.searchText) || card.bankName.toLowerCase().includes(vm.searchText.toLowerCase());
          var matchesStatus = vm.statusFilter === 'All' || card.status === vm.statusFilter;
          return matchesSearch && matchesStatus;
        });
      };
      vm.selectCard = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      loadCards();
    }]);
})();