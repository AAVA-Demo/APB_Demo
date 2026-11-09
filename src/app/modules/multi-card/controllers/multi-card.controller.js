(function() {
  'use strict';
  angular.module('creditCard.multiCard').controller('MultiCardController', ['$scope', 'MultiCardService', 'CardComparisonService', function($scope, MultiCardService, CardComparisonService) {
    var vm = this;
    vm.cardPortfolio = null;
    vm.loading = true;
    vm.error = null;
    vm.selectedCards = [];
    vm.comparisonResult = null;
    vm.selectedCardDetail = null;
    vm.init = function() {
      MultiCardService.getAllCards().then(function(portfolio) {
        vm.cardPortfolio = portfolio;
        vm.loading = false;
        $scope.$apply();
      }, function(error) {
        vm.error = 'Failed to load card data';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.toggleCardSelection = function(card) {
      var index = vm.selectedCards.indexOf(card);
      if (index > -1) {
        vm.selectedCards.splice(index, 1);
      } else {
        vm.selectedCards.push(card);
      }
    };
    vm.compareSelected = function() {
      if (vm.selectedCards.length >= 2) {
        vm.comparisonResult = CardComparisonService.compareCards(vm.selectedCards);
      }
    };
    vm.viewCardDetail = function(card) {
      vm.selectedCardDetail = card;
    };
    vm.closeDetail = function() {
      vm.selectedCardDetail = null;
    };
    vm.init();
  }]);
})();