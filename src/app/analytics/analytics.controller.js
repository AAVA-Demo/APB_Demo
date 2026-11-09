(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .controller('AnalyticsController', ['$scope', 'AnalyticsProcessingService', 'AnalyticsCacheFactory', function($scope, AnalyticsProcessingService, AnalyticsCacheFactory) {
      var vm = this;
      vm.categoryData = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      function loadAnalytics() {
        vm.loading = true;
        var cached = AnalyticsCacheFactory.get('analytics');
        if (cached) {
          vm.categoryData = cached.categoryData;
          vm.monthlyTrends = cached.monthlyTrends;
          vm.loading = false;
          return;
        }
        AnalyticsProcessingService.getAnalytics().then(function(data) {
          vm.categoryData = data.categoryData;
          vm.monthlyTrends = data.monthlyTrends;
          AnalyticsCacheFactory.put('analytics', data);
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load analytics.';
          vm.loading = false;
        });
      }
      loadAnalytics();
    }]);
})();