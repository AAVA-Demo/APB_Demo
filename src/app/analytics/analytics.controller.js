(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['AnalyticsService', '$scope', '$filter'];
  function AnalyticsController(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.categoryData = null;
    vm.monthlyTrends = null;
    vm.loading = true;
    vm.error = null;
    vm.dateRange = {
      startDate: getDefaultStartDate(),
      endDate: new Date()
    };
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      AnalyticsService.getCategorySpending(vm.dateRange.startDate.toISOString(), vm.dateRange.endDate.toISOString())
        .then(function(data) {
          vm.categoryData = data.categories || [];
          vm.monthlyTrends = data.monthlyTrends || [];
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    function getDefaultStartDate() {
      var date = new Date();
      date.setMonth(date.getMonth() - 12);
      return date;
    }
  }
})();