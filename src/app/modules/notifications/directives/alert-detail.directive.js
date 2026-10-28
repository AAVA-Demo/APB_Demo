(function() {
  'use strict';
  angular.module('fraudAlertApp').directive('alertDetail', ['alertService', function(alertService) {
    return {
      restrict: 'E',
      scope: {
        alert: '=',
        onConfirm: '&',
        onReport: '&'
      },
      templateUrl: 'src/app/modules/notifications/views/alert-detail.view.html',
      link: function(scope, element, attrs) {
        scope.maskCardNumber = (cardId) => {
          if (!cardId) return '****';
          const cardStr = String(cardId);
          if (cardStr.length < 4) return '****';
          return '****' + cardStr.slice(-4);
        };
        scope.getSeverityClass = (severity) => {
          return 'severity-' + (severity || 'medium');
        };
      }
    };
  }]);
})();