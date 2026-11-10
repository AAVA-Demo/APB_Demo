(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsDashboardController', ['AnalyticsDataService', 'CategoryService', 'AuthService', '$scope', function(AnalyticsDataService, CategoryService, AuthService, $scope) {
      var vm = this;
      vm.analytics = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedMonths = 12;
      vm.categories = CategoryService.getCategories();
      vm.init = function() {
        var userId = AuthService.getUserId();
        vm.loadAnalytics(userId, vm.selectedMonths);
      };
      vm.loadAnalytics = function(userId, months) {
        vm.loading = true;
        AnalyticsDataService.getSpendingAnalytics(userId, months)
          .then(function(data) {
            vm.analytics = data;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            toastr.error('Failed to load analytics data');
          });
      };
      vm.changeMonths = function(months) {
        vm.selectedMonths = months;
        vm.loadAnalytics(AuthService.getUserId(), months);
      };
      vm.init();
    }]);
})();