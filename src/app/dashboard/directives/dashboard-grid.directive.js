(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('dashboardGrid', [function() {
      return {
        restrict: 'E',
        transclude: true,
        template: '<div class="row" ng-transclude></div>'
      };
    }]);
})();