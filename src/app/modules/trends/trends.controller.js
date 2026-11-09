(function() {
  'use strict';
  angular.module('app.trends')
    .controller('TrendsController', ['$scope', 'TrendAnalysisService', 'DateFilterFactory', 'CreditCardService', function($scope, TrendAnalysisService, DateFilterFactory, CreditCardService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.monthlyTrends = [];
      vm.cardWiseData = [];
      vm.cards = [];
      vm.selectedCards = [];
      const defaultRange = DateFilterFactory.getDefaultDateRange();
      vm.startDate = defaultRange.startDate;
      vm.endDate = defaultRange.endDate;
      let debounceTimer;
      vm.init = function() {
        CreditCardService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.selectedCards = cards.map(function(c) { return c.cardId; });
            return vm.loadTrendData();
          })
          .catch(function(error) {
            vm.error = 'Failed to load trend data. Please try again.';
            vm.loading = false;
            console.error('Error loading trends:', error);
            $scope.$apply();
          });
      };
      vm.loadTrendData = function() {
        if (!DateFilterFactory.validateDateRange(vm.startDate, vm.endDate)) {
          vm.error = 'Invalid date range. Please select a range within 12 months.';
          vm.loading = false;
          $scope.$apply();
          return Promise.reject('Invalid date range');
        }
        const request = {
          startDate: vm.startDate,
          endDate: vm.endDate,
          cardIds: vm.selectedCards
        };
        return TrendAnalysisService.getAllTrendData(request)
          .then(function(data) {
            vm.monthlyTrends = data.monthly;
            vm.cardWiseData = data.cardwise;
            vm.loading = false;
            vm.error = null;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load trend data. Please try again.';
            vm.loading = false;
            console.error('Error loading trend data:', error);
            $scope.$apply();
          });
      };
      vm.onDateChange = function() {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(function() {
          vm.loading = true;
          vm.loadTrendData();
        }, 300);
      };
      vm.toggleCardSelection = function(cardId) {
        const index = vm.selectedCards.indexOf(cardId);
        if (index > -1) {
          vm.selectedCards.splice(index, 1);
        } else {
          vm.selectedCards.push(cardId);
        }
        vm.loading = true;
        vm.loadTrendData();
      };
      vm.isCardSelected = function(cardId) {
        return vm.selectedCards.indexOf(cardId) > -1;
      };
      vm.formatCurrency = function(amount) {
        return '$' + (amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.init();
    }]);
})();