(function() {
  'use strict';
  angular.module('app.cardManagement')
    .component('cardItem', {
      templateUrl: 'src/app/components/card-item.html',
      bindings: {
        card: '<',
        onSelect: '&'
      },
      controller: function() {
        var ctrl = this;
        ctrl.selectCard = function() {
          ctrl.onSelect();
        };
      }
    });
})();