(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['$scope', '$location', 'CardService', 'SpendAnalyticsService', function($scope, $location, CardService, SpendAnalyticsService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.filterText = '';
      vm.selectedStatus = 'all';
      function loadCards() {
        vm.loading = true;
        vm.error = null;
        CardService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load cards. Please try again.';
            vm.loading = false;
          });
      }
      vm.viewCardDetails = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.filterCards = function(card) {
        var matchesStatus = vm.selectedStatus === 'all' || card.status === vm.selectedStatus;
        var matchesText = !vm.filterText || 
          card.cardNumber.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1 ||
          card.issuer.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1 ||
          card.cardHolderName.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1;
        return matchesStatus && matchesText;
      };
      loadCards();
    }]);
})();