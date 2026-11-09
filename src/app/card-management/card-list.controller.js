(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardListController', ['$scope', '$state', 'DataAggregationService', 'UserProfileFactory', function($scope, $state, DataAggregationService, UserProfileFactory) {
      var vm = this;
      vm.cards = [];
      vm.aggregatedData = {};
      vm.loading = true;
      vm.error = null;
      function loadCards() {
        vm.loading = true;
        var userId = UserProfileFactory.getUserId();
        DataAggregationService.getAggregatedCardData(userId).then(function(data) {
          vm.cards = data.cards;
          vm.aggregatedData = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load cards.';
          vm.loading = false;
        });
      }
      vm.viewCardDetail = function(cardId) {
        $state.go('cardDetail', { cardId: cardId });
      };
      loadCards();
    }]);
})();