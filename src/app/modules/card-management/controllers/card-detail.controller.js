(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardDetailController', ['$scope', '$routeParams', 'CardService', 'TransactionService', 'CardComparisonService', 'NotificationService', function($scope, $routeParams, CardService, TransactionService, CardComparisonService, NotificationService) {
      var vm = this;
      vm.card = null;
      vm.transactions = [];
      vm.loading = true;
      vm.error = null;
      vm.utilization = 0;
      var cardId = $routeParams.cardId;
      function loadCardDetails() {
        vm.loading = true;
        CardService.getCardById(cardId)
          .then(function(cardData) {
            vm.card = cardData;
            vm.utilization = CardComparisonService.calculateUtilization(cardData);
            return TransactionService.getTransactions(cardId);
          })
          .then(function(transactionData) {
            vm.transactions = transactionData;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
            NotificationService.error(vm.error);
          });
      }
      loadCardDetails();
      vm.retry = function() {
        loadCardDetails();
      };
    }]);
})();