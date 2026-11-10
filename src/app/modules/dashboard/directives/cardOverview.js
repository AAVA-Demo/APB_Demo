(function() {
  'use strict';
  angular.module('dashboardModule').directive('cardOverview', [function() {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      template: '<div class="card-overview"><h4>{{::card.cardName}}</h4><div class="row"><div class="col-xs-6"><small>Credit Limit</small><p><strong>${{card.creditLimit | number:2}}</strong></p></div><div class="col-xs-6"><small>Outstanding</small><p><strong>${{card.outstandingAmount | number:2}}</strong></p></div></div><div class="row"><div class="col-xs-6"><small>Available Credit</small><p><strong>${{card.availableCredit | number:2}}</strong></p></div><div class="col-xs-6"><small>Monthly Spend</small><p><strong>${{card.monthlySpend | number:2}}</strong></p></div></div></div>'
    };
  }]);
})();