(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardListController', ['$scope', 'CardService', 'CardComparisonService', 'NotificationService', function($scope, CardService, CardComparisonService, NotificationService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.comparisonData = [];
      function loadCards() {
        vm.loading = true;
        CardService.getAllCards()
          .then(function(data) {
            vm.cards = data;
            vm.comparisonData = CardComparisonService.compareCards(data);
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
            NotificationService.error(vm.error);
          });
      }
      loadCards();
      vm.retry = function() {
        loadCards();
      };
    }]);
})();