(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', 'CardService', function($scope, CardService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCard = null;
      vm.showModal = false;

      vm.init = function() {
        vm.loadCards();
      };

      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        CardService.getUserCards().then(function(data) {
          vm.cards = data.cards;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load credit cards';
          vm.loading = false;
        });
      };

      vm.viewCardDetails = function(card) {
        vm.selectedCard = card;
        vm.showModal = true;
      };

      vm.closeModal = function() {
        vm.showModal = false;
        vm.selectedCard = null;
      };

      vm.refresh = function() {
        CardService.clearCache();
        vm.loadCards();
      };

      vm.init();
    }]);
})();