(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailsController', ['$scope', '$routeParams', '$location', 'CardManagementService', function($scope, $routeParams, $location, CardManagementService) {
      var vm = this;
      vm.card = null;
      vm.spending = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        var cardId = $routeParams.cardId;
        CardManagementService.getCardDetails(cardId)
          .then(function(data) {
            vm.card = data.card;
            vm.spending = data.spending;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
          });
      };
      vm.goBack = function() {
        $location.path('/card-management');
      };
      vm.init();
    }]);
})();