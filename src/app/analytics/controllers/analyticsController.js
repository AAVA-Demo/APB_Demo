(function() {
  'use strict';
  angular.module('analytics')
    .controller('analyticsController', ['$scope', 'aggregationService', function($scope, aggregationService) {
      var vm = this;
      vm.categoryData = [];
      vm.monthlyTrends = [];
      vm.cardWiseData = [];
      vm.loading = true;
      vm.init = function() {
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          vm.categoryData = analytics.categoryData;
          vm.monthlyTrends = analytics.monthlyTrends;
          vm.cardWiseData = analytics.cardWiseData;
          vm.loading = false;
        }).catch(function(err) {
          console.error('Error loading analytics:', err);
          vm.loading = false;
        });
      };
      vm.init();
    }]);