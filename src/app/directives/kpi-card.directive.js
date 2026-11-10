(function() {
  'use strict';
  angular.module('creditCardApp').directive('kpiCard', [function() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        label: '@',
        value: '@',
        color: '@'
      },
      template: '<div class="panel panel-{{color}}"><div class="panel-body"><div class="row"><div class="col-xs-3"><i class="glyphicon {{icon}}" style="font-size: 3em;"></i></div><div class="col-xs-9 text-right"><div class="huge">{{value}}</div><div>{{label}}</div></div></div></div></div>'
    };
  }]);
})();