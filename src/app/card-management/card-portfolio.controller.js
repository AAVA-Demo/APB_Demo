(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardPortfolioController', ['CardManagementService', 'AuthService', '$scope', function(CardManagementService, AuthService, $scope) {
      var vm = this;
      vm.portfolio = null;
      vm.loading = true;
      vm.error = null;
      vm.sortBy = 'monthlySpend';
      vm.sortReverse = true;
      vm.init = function() {
        AuthService.validateSession()
          .then(function(session) {
            return CardManagementService.getUserCards(session.userId);
          })
          .then(function(portfolio) {
            vm.portfolio = portfolio;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load card portfolio';
            vm.loading = false;
            toastr.error('Failed to load card portfolio');
          });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
      };
      vm.setSortBy = function(field) {
        if (vm.sortBy === field) {
          vm.sortReverse = !vm.sortReverse;
        } else {
          vm.sortBy = field;
          vm.sortReverse = true;
        }
      };
      vm.init();
    }]);
})();