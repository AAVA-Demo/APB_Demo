(function() {
  'use strict';
  angular.module('creditcard.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', AnalyticsController]);
  function AnalyticsController(AnalyticsService, $scope) {
    var vm = this;
    vm.analyticsData = {};
    vm.loading = true;
    vm.error = null;
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getAnalytics()
        .then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
  }
})();