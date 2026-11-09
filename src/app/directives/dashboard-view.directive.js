(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('dashboardView', [function() {
      return {
        restrict: 'A',
        scope: {
          kpi: '='
        },
        template: '<div class="row">' +
          '<div class="col-xs-12 col-sm-6 col-md-3">' +
          '<div class="panel panel-primary">' +
          '<div class="panel-heading">Monthly Spend</div>' +
          '<div class="panel-body"><h3>{{kpi.monthlySpend | currency}}</h3></div>' +
          '</div>' +
          '</div>' +
          '<div class="col-xs-12 col-sm-6 col-md-3">' +
          '<div class="panel panel-success">' +
          '<div class="panel-heading">Total Credit Limit</div>' +
          '<div class="panel-body"><h3>{{kpi.totalCreditLimit | currency}}</h3></div>' +
          '</div>' +
          '</div>' +
          '<div class="col-xs-12 col-sm-6 col-md-3">' +
          '<div class="panel panel-info">' +
          '<div class="panel-heading">Available Credit</div>' +
          '<div class="panel-body"><h3>{{kpi.availableCredit | currency}}</h3></div>' +
          '</div>' +
          '</div>' +
          '<div class="col-xs-12 col-sm-6 col-md-3">' +
          '<div class="panel panel-warning">' +
          '<div class="panel-heading">Outstanding Amount</div>' +
          '<div class="panel-body"><h3>{{kpi.outstandingAmount | currency}}</h3></div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="row">' +
          '<div class="col-xs-12"><p class="text-muted">Last updated: {{kpi.lastUpdated | date:"medium"}}</p></div>' +
          '</div>'
      };
    }]);
})();