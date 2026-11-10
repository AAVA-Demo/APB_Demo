(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardSelectorController', ['CardDataService', 'CardAnalyticsService', '$scope', '$rootScope', function(CardDataService, CardAnalyticsService, $scope, $rootScope) {
      var vm = this;
      vm.selectedCard = null;
      vm.analytics = null;
      $scope.$on('cardSelected', function(event, card) {
        vm.selectedCard = card;
        CardAnalyticsService.getCardAnalytics(card.cardId)
          .then(function(analytics) {
            vm.analytics = analytics;
            $scope.$apply();
          });
      });
    }]);
})();