(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', CardDetailController);
  CardDetailController.$inject = ['$scope', '$routeParams', 'CardManagementService'];
  function CardDetailController($scope, $routeParams, CardManagementService) {
    var vm = this;
    vm.selectedCard = null;
    vm.spendAnalysis = null;
    vm.loading = true;
    vm.error = null;
    function init() {
      var cardId = $routeParams.cardId;
      CardManagementService.getCardDetail(cardId)
        .then(function(data) {
          vm.selectedCard = data.card;
          vm.spendAnalysis = data.spendAnalysis;
          vm.loading = false;
        })
        .catch(function(err) {
          vm.error = 'Failed to load card details';
          vm.loading = false;
        });
    }
    init();
  }
})();