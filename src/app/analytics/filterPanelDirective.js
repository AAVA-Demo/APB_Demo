(function() {
  'use strict';
  angular.module('creditCardApp').directive('filterPanel', [function() {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        categories: '=',
        onApply: '&',
        onReset: '&'
      },
      template: '<div class="panel panel-default"><div class="panel-heading">Filters</div><div class="panel-body"><form class="form-inline"><div class="form-group"><label>Start Date:</label> <input type="date" class="form-control" ng-model="filters.startDate"></div><div class="form-group"><label>End Date:</label> <input type="date" class="form-control" ng-model="filters.endDate"></div><div class="form-group"><label>Category:</label> <select class="form-control" ng-model="filters.category" ng-options="cat for cat in categories"></select></div><button type="button" class="btn btn-primary" ng-click="onApply()">Apply</button> <button type="button" class="btn btn-default" ng-click="onReset()">Reset</button></form></div></div>'
    };
  }]);
})();