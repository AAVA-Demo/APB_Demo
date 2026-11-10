(function() {
  'use strict';
  angular.module('app.dashboard')
    .component('kpiCard', {
      templateUrl: 'src/app/components/kpi-card.html',
      bindings: {
        title: '<',
        value: '<',
        icon: '<'
      },
      controller: function() {}
    });
})();