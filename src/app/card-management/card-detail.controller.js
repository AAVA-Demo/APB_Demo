(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardDetailController', ['$stateParams', '$state', 'CardManagementService', function($stateParams, $state, CardManagementService) {
    const vm = this;
    vm.cardDetail = null;
    vm.loading = true;
    vm.error = null;
    const cardId = $stateParams.cardId;
    function loadCardDetails() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getCardDetails(cardId).then(function(cardDetail) {
        vm.cardDetail = cardDetail;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load card details. Please try again.';
        vm.loading = false;
      });
    }
    loadCardDetails();
    vm.goBack = function() {
      $state.go('cardManagement');
    };
    vm.getCategoryColor = function(category) {
      const colors = {
        'Food & Dining': '#FF6384',
        'Fuel': '#36A2EB',
        'Shopping': '#FFCE56',
        'Travel': '#4BC0C0',
        'Entertainment': '#9966FF',
        'Utilities': '#FF9F40',
        'Healthcare': '#FF6384',
        'Education': '#C9CBCF',
        'Miscellaneous': '#4BC0C0'
      };
      return colors[category] || '#999';
    };
  }]);
})();