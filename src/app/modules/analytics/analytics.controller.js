(function() {
  'use strict';
  angular.module('creditCard.analytics').controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
    var vm = this;
    vm.categoryData = [];
    vm.monthlyData = [];
    vm.cardData = [];
    vm.loading = true;
    vm.error = null;
    function init() {
      var promises = [
        AnalyticsService.getCategoryWiseSpending(),
        AnalyticsService.getMonthlyTrends(),
        AnalyticsService.getCardWiseSpending()
      ];
      Promise.all(promises).then(function(results) {
        vm.categoryData = results[0];
        vm.monthlyData = results[1];
        vm.cardData = results[2];
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.error = 'Failed to load analytics. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }
    init();
  }]);
})();