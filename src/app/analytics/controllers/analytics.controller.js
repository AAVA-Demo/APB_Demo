(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', AnalyticsController]);

  function AnalyticsController($scope, $filter, AnalyticsService) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.monthlyTrends = null;
    vm.categoryWise = null;
    vm.cardWise = null;
    vm.filters = { period: '12months' };
    vm.applyFilters = applyFilters;

    activate();

    function activate() {
      loadAnalytics();
    }

    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingAnalytics(vm.filters)
        .then(function(data) {
          vm.monthlyTrends = data.monthlyTrends;
          vm.categoryWise = data.categoryWise;
          vm.cardWise = data.cardWise;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }

    function applyFilters() {
      loadAnalytics();
    }
  }
  AnalyticsController.$inject = ['$scope', '$filter', 'AnalyticsService'];
})();