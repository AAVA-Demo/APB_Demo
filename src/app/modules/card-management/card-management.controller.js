(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardManagementController', ['CardManagementService', 'SpendingAnalyticsService', '$scope', function(CardManagementService, SpendingAnalyticsService, $scope) {
      var vm = this;
      vm.cardPortfolio = null;
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        CardManagementService.getCardPortfolio('user123').then(function(portfolio) {
          vm.cardPortfolio = portfolio;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load card portfolio. Please try again.';
          vm.loading = false;
        });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
      };
      vm.init();
    }]);
})();