(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$routeParams', '$location', 'CardManagementService', function($scope, $routeParams, $location, CardManagementService) {
      var vm = this;
      vm.portfolio = { cards: [], spending: [], totalCards: 0, consolidatedBalance: 0, consolidatedLimit: 0 };
      vm.cardDetail = { card: null, spending: null, transactions: [] };
      vm.loading = true;
      vm.error = null;
      vm.viewMode = $routeParams.cardId ? 'detail' : 'list';
      if (vm.viewMode === 'list') {
        CardManagementService.getCardPortfolio().then(function(portfolio) {
          vm.portfolio = portfolio;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load card portfolio. Please try again.';
          vm.loading = false;
        });
      } else {
        CardManagementService.getCardDetails($routeParams.cardId).then(function(detail) {
          vm.cardDetail = detail;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
      }
      vm.selectCard = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.backToList = function() {
        $location.path('/cards');
      };
    }]);
})();