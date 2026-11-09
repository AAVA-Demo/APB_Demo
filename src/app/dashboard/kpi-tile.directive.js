(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiTile', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="kpi-tile">' +
                  '<h3><i class="glyphicon glyphicon-{{icon}}"></i> {{title}}</h3>' +
                  '<div class="value">₹{{value | number:0}}</div>' +
                  '</div>'
      };
    });
})();