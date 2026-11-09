(function() {
  'use strict';
  angular.module('creditCard.analytics').directive('analyticsFilter', [function() {
    return {
      restrict: 'E',
      scope: {
        dateRange: '=',
        onApply: '&'
      },
      template: '<div class="well"><div class="row"><div class="col-md-5"><label>Start Date</label><input type="date" class="form-control" ng-model="dateRange.start"></div><div class="col-md-5"><label>End Date</label><input type="date" class="form-control" ng-model="dateRange.end"></div><div class="col-md-2"><label>&nbsp;</label><button class="btn btn-primary form-control" ng-click="onApply()">Apply</button></div></div></div>'
    };
  }]);
})();