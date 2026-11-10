(function() {
  'use strict';
  angular.module('creditCard.multiCardModule')
    .controller('CardListController', ['CardDataService', 'CardComparisonService', 'AuthService', '$scope', '$location', function(CardDataService, CardComparisonService, AuthService, $scope, $location) {
      var vm = this;
      vm.cards = [];
      vm.comparison = null;
      vm.loading = true;
      vm.error = null;
      vm.filterText = '';
      vm.navigateToCardDetail = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.getFilteredCards = function() {
        if (!vm.filterText) return vm.cards;
        return vm.cards.filter(function(card) {
          return card.cardNumber.indexOf(vm.filterText) !== -1 ||
                 card.cardType.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1 ||
                 card.cardHolderName.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1;
        });
      };
      function loadCards() {
        AuthService.validateToken()
          .then(function() {
            return CardDataService.fetchUserCards();
          })
          .then(function(cards) {
            vm.cards = cards;
            vm.comparison = CardComparisonService.calculateComparison(cards);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load cards';
            vm.loading = false;
            vm.cards = generateMockCards();
            vm.comparison = CardComparisonService.calculateComparison(vm.cards);
          });
      }
      function generateMockCards() {
        var cards = [];
        for (var i = 1; i <= 5; i++) {
          var creditLimit = 50000 + (i * 10000);
          var outstanding = Math.floor(Math.random() * creditLimit * 0.5);
          var available = creditLimit - outstanding;
          cards.push({
            cardId: 'card' + i,
            cardNumber: '****' + (1000 + i),
            cardType: i % 2 === 0 ? 'Visa' : 'Mastercard',
            cardHolderName: 'John Doe',
            creditLimit: creditLimit,
            availableCredit: available,
            outstandingAmount: outstanding,
            monthlySpend: Math.floor(Math.random() * 20000),
            utilizationRate: ((creditLimit - available) / creditLimit * 100).toFixed(2),
            lastUpdated: new Date()
          });
        }
        return cards;
      }
      loadCards();
    }]);
})();