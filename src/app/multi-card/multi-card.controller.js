(function() {
  'use strict';
  angular.module('creditCard.multiCardModule').controller('MultiCardController', ['$scope', 'CardManagementService', 'SpendAnalysisService', 'UserProfileFactory', function($scope, CardManagementService, SpendAnalysisService, UserProfileFactory) {
    const vm = this;
    vm.cards = [];
    vm.comparison = null;
    vm.isLoading = true;
    vm.error = null;
    vm.selectedCard = null;
    vm.searchQuery = '';
    vm.sortBy = 'cardType';
    
    function loadCards() {
      vm.isLoading = true;
      vm.error = null;
      
      const user = UserProfileFactory.getUserProfile();
      
      CardManagementService.getAllCards(user.userId).then(function(cards) {
        vm.cards = cards;
        return SpendAnalysisService.calculateComparisons(cards);
      }).then(function(comparison) {
        vm.comparison = comparison;
        vm.isLoading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load card data. Please try again.';
        vm.isLoading = false;
      });
    }
    
    vm.selectCard = function(card) {
      vm.selectedCard = card;
    };
    
    vm.refresh = function() {
      CardManagementService.clearCache();
      loadCards();
    };
    
    vm.sortCards = function(field) {
      vm.sortBy = field;
    };
    
    vm.init = function() {
      loadCards();
    };
    
    vm.init();
  }]);
})();