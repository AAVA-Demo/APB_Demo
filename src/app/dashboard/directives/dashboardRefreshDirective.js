(function() {
  'use strict';
  angular.module('dashboardModule').directive('dashboardRefresh', [function() {
    return {
      restrict: 'E',
      scope: {
        onRefresh: '&'
      },
      template: '<button class="btn btn-primary refresh-btn" ng-click="refresh()">' +
                '  <span class="glyphicon glyphicon-refresh"></span> Refresh' +
                '</button>',
      link: function(scope) {
        scope.refresh = function() {
          if (scope.onRefresh) {
            scope.onRefresh();
          }
        };
      }
    };
  }]);
})();