(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['CardManagementService', 'CardAnalyticsService', '$routeParams', '$scope', function(CardManagementService, CardAnalyticsService, $routeParams, $scope) {
      const vm = this;
      vm.card = null;
      vm.analytics = null;
      vm.transactions = [];
      vm.loading = true;
      vm.error = null;
      const cardId = $routeParams.cardId;
      vm.loadCardDetails = function() {
        vm.loading = true;
        CardManagementService.getCardDetails(cardId)
          .then(function(card) {
            vm.card = card;
            return CardAnalyticsService.getCardAnalytics(cardId);
          })
          .then(function(analytics) {
            vm.analytics = analytics;
            vm.transactions = analytics.recentTransactions || [];
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load card details.';
            vm.loading = false;
            console.error('Card detail error:', err);
          });
      };
      vm.loadCardDetails();
    }]);
})();