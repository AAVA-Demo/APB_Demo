(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['CardService', '$routeParams', '$scope', '$location', CardDetailController]);
  function CardDetailController(CardService, $routeParams, $scope, $location) {
    var vm = this;
    vm.cardDetail = null;
    vm.loading = true;
    vm.error = null;
    vm.cardId = $routeParams.cardId;
    vm.init = function() {
      vm.loadCardDetail();
    };
    vm.loadCardDetail = function() {
      vm.loading = true;
      vm.error = null;
      CardService.getCardDetail(vm.cardId)
        .then(function(cardDetail) {
          vm.cardDetail = cardDetail;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details';
          vm.loading = false;
          toastr.error('Unable to fetch card details', 'Error');
          $scope.$apply();
        });
    };
    vm.goBack = function() {
      $location.path('/cards');
    };
    vm.init();
  }
})();