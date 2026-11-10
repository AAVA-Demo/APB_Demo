(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '@',
          icon: '@',
          color: '@'
        },
        template: '<div class="card kpi-card" style="border-left: 4px solid {{color}};"><div class="card-body"><div class="row align-items-center"><div class="col"><h6 class="text-muted mb-2">{{title}}</h6><h3 class="mb-0">{{value}}</h3></div><div class="col-auto"><i class="{{icon}} kpi-icon" style="color: {{color}};"></i></div></div></div></div>'
      };
    });
})();