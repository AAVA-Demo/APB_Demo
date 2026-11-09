(function() {
  'use strict';
  angular.module('creditCard.dashboard').directive('dashboardLayout', [function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.addClass('row');
      }
    };
  }]);
})();