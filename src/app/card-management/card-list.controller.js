(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', CardListController);
  CardListController.$inject = ['$scope', '$location', 'CardManagementService'];
  function CardListController($scope, $location, CardManagementService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectCard = function(cardId) {
      $location.path('/cards/' + cardId);
    };
    function init() {
      CardManagementService.getAllCards()
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(err) {
          vm.error = 'Failed to load cards';
          vm.loading = false;
        });
    }
    init();
  }
})();