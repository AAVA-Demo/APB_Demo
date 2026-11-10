(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', AnalyticsController);
  AnalyticsController.$inject = ['AnalyticsService', '$scope', '$filter'];
  function AnalyticsController(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.error = null;
    vm.activeTab = 'category';
    vm.filters = {
      startDate: null,
      endDate: null,
      category: null,
      cardId: null
    };
    vm.setActiveTab = setActiveTab;
    vm.applyFilter = applyFilter;
    vm.clearFilters = clearFilters;
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      AnalyticsService.loadAnalytics().then(function(data) {
        vm.analytics = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
      });
    }
    function setActiveTab(tab) {
      vm.activeTab = tab;
    }
    function applyFilter() {
      vm.loading = true;
      AnalyticsService.filterAnalytics(vm.filters).then(function(data) {
        vm.analytics = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to apply filters';
        vm.loading = false;
      });
    }
    function clearFilters() {
      vm.filters = {
        startDate: null,
        endDate: null,
        category: null,
        cardId: null
      };
      loadAnalytics();
    }
  }
})();