(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .controller('AnalyticsController', ['AnalyticsEngineService', 'AuthService', '$scope', function(AnalyticsEngineService, AuthService, $scope) {
      var vm = this;
      vm.categoryData = null;
      vm.trendData = null;
      vm.loading = true;

      function init() {
        AuthService.validateSession().then(function(session) {
          loadAnalytics(session.userId);
        });
      }

      function loadAnalytics(userId) {
        AnalyticsEngineService.getInsights(userId, { months: 12 }).then(function(insights) {
          vm.categoryData = insights.categoryInsights;
          vm.trendData = insights.monthlyTrends;
          vm.loading = false;
          $scope.$apply();
        });
      }

      init();
    }]);
})();