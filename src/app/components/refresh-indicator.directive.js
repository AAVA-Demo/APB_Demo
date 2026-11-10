(function() {
  'use strict';
  angular.module('creditCardApp').directive('refreshIndicator', [function() {
    return {
      restrict: 'E',
      scope: {
        lastUpdated: '='
      },
      template: '<div class="last-updated text-center"><span class="glyphicon glyphicon-time"></span> Last updated: {{formattedTime}}</div>',
      link: function(scope, element, attrs) {
        scope.$watch('lastUpdated', function(newVal) {
          if (newVal) {
            scope.formattedTime = new Date(newVal).toLocaleString();
          }
        });
      }
    };
  }]);
})();