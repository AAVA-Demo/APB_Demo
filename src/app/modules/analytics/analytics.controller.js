(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', AnalyticsController]);
  function AnalyticsController(AnalyticsService, $scope) {
    var vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.error = null;
    vm.selectedView = 'category';
    vm.setView = setView;
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingInsights()
        .then(function(data) {
          vm.analytics = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    function setView(view) {
      vm.selectedView = view;
    }
  }
})();