(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardDetailController', CardDetailController);
  CardDetailController.$inject = ['CardDataService', '$stateParams', '$scope', 'cardDetail'];
  function CardDetailController(CardDataService, $stateParams, $scope, cardDetail) {
    var vm = this;
    vm.card = cardDetail || {};
    vm.loading = false;
    vm.error = null;
  }
})();