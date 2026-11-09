(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.analyticsData = {};
      vm.loading = true;
      vm.error = null;
      vm.filters = {
        dateFrom: null,
        dateTo: null,
        cardId: ''
      };
      vm.cards = [];
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.getSpendingData(vm.filters)
          .then(function(data) {
            vm.analyticsData = data;
            vm.cards = extractCards(data);
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
          });
      }
      function extractCards(data) {
        if (!data.cardWiseSpend) return [];
        return Object.keys(data.cardWiseSpend).map(function(cardId) {
          return { cardId: cardId, spend: data.cardWiseSpend[cardId] };
        });
      }
      vm.applyFilters = function() {
        loadAnalytics();
      };
      vm.clearFilters = function() {
        vm.filters = {
          dateFrom: null,
          dateTo: null,
          cardId: ''
        };
        loadAnalytics();
      };
      loadAnalytics();
    }]);
})();