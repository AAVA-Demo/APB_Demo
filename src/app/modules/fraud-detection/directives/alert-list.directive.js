(function() {
  'use strict';
  angular.module('fraudAlertApp').directive('alertList', ['alertService', function(alertService) {
    return {
      restrict: 'E',
      scope: {
        alerts: '='
      },
      templateUrl: 'src/app/modules/fraud-detection/views/alert-list.view.html',
      link: function(scope, element, attrs) {
        scope.getSeverityClass = (severity) => {
          return 'severity-' + (severity || 'medium');
        };
        scope.getStatusClass = (status) => {
          return 'status-' + (status || 'created');
        };
        scope.viewAlert = (alertId) => {
          window.location.href = '#/alert/' + alertId;
        };
      }
    };
  }]);
})();