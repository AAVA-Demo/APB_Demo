(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('creditCardList', [creditCardList]);

  function creditCardList() {
    return {
      restrict: 'E',
      scope: {
        cards: '<'
      },
      templateUrl: 'src/app/dashboard/views/credit-card-list.html'
    };
  }
})();