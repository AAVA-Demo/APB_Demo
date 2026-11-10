(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardDetail', [function() {
      return {
        restrict: 'A',
        scope: {
          card: '='
        },
        template: '<div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">' +
                  '<p><small>Card ID: {{card.cardId}}</small></p>' +
                  '<p ng-if="card.topCategories"><small>Top Categories: {{card.topCategories.join(", ")}}</small></p>' +
                  '</div>'
      };
    }]);
})();