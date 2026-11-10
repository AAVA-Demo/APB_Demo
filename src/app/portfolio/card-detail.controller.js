(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .controller('CardDetailController', ['$scope', '$routeParams', '$location', '$q', 'CardManagementService', 'CardMetricsService', 'toastr', function($scope, $routeParams, $location, $q, CardManagementService, CardMetricsService, toastr) {
      const vm = this;
      vm.card = null;
      vm.metrics = null;
      vm.loading = true;
      const cardId = $routeParams.cardId;
      vm.loadCardDetails = function() {
        const detailsPromise = CardManagementService.getCardDetails(cardId);
        const metricsPromise = CardMetricsService.getCardMetrics(cardId);
        $q.all([detailsPromise, metricsPromise])
          .then(function(results) {
            vm.card = results[0];
            vm.metrics = results[1];
            vm.loading = false;
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load card details');
          });
      };
      vm.goBack = function() {
        $location.path('/portfolio');
      };
      vm.loadCardDetails();
    }]);
})();