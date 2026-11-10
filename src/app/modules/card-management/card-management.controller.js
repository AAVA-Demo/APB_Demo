(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', 'CardService', 'UserProfileService', 'CardComparisonFactory', function($scope, CardService, UserProfileService, CardComparisonFactory) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.portfolio = {};
      vm.selectedCard = null;
      vm.comparison = [];
      vm.currentUser = UserProfileService.getCurrentUser();
      vm.init = function() {
        UserProfileService.validateUser(vm.currentUser.userId)
          .then(function(valid) {
            if (valid) {
              return vm.loadPortfolio();
            } else {
              throw new Error('User validation failed');
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to validate user. Please login again.';
            vm.loading = false;
            toastr.error('User validation failed');
          });
      };
      vm.loadPortfolio = function() {
        vm.loading = true;
        CardService.getCardPortfolio(vm.currentUser.userId)
          .then(function(portfolio) {
            vm.portfolio = portfolio;
            vm.comparison = CardComparisonFactory.compareCards(portfolio.cards);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card portfolio. Please try again.';
            vm.loading = false;
            toastr.error('Failed to load card portfolio');
          });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
      };
      vm.formatCurrency = function(value) {
        return '$' + (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.init();
    }]);
})();