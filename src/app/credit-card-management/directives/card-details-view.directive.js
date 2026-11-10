(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardDetailsView', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          spending: '='
        },
        templateUrl: 'src/app/credit-card-management/views/card-details-view.template.html'
      };
    }]);
})();