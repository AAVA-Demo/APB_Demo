(function() {
  'use strict';
  angular.module('creditCard.multiCardModule')
    .controller('MultiCardViewController', ['$scope', '$q', 'UserProfileFactory', 'CreditCardDataService', 'CardMetadataService', 'CardAnalyticsService', 'AuthService', function($scope, $q, UserProfileFactory, CreditCardDataService, CardMetadataService, CardAnalyticsService, AuthService) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        var userId = AuthService.getUserId();
        UserProfileFactory.getUserCards(userId)
          .then(function(profile) {
            var cardPromises = [];
            profile.associatedCards.forEach(function(cardId) {
              var cardPromise = vm.loadCardData(cardId);
              cardPromises.push(cardPromise);
            });
            return $q.all(cardPromises);
          })
          .then(function(cards) {
            vm.cards = cards;
            if (vm.cards.length > 0) {
              vm.selectedCard = vm.cards[0];
            }
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards';
            vm.loading = false;
          });
      };
      vm.loadCardData = function(cardId) {
        var cardData = {};
        return CreditCardDataService.getCardData(cardId)
          .then(function(data) {
            cardData = data;
            return CardMetadataService.getCardMetadata(cardId);
          })
          .then(function(metadata) {
            angular.extend(cardData, metadata);
            return CardAnalyticsService.calculateMetrics(cardData);
          })
          .then(function(metrics) {
            cardData.metrics = metrics;
            return cardData;
          });
      };
      vm.onCardSelect = function(card) {
        vm.selectedCard = card;
      };
      vm.init();
    }]);
})();