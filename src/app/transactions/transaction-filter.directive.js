(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionFilter', function() {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        onApply: '&'
      },
      template: '<div class="card-item"><h4>Filters</h4><div class="form-group"><label>Start Date</label><input type="date" class="form-control" ng-model="filters.startDate"></div><div class="form-group"><label>End Date</label><input type="date" class="form-control" ng-model="filters.endDate"></div><div class="form-group"><label>Min Amount</label><input type="number" class="form-control" ng-model="filters.minAmount"></div><div class="form-group"><label>Max Amount</label><input type="number" class="form-control" ng-model="filters.maxAmount"></div><button class="btn btn-primary" ng-click="onApply()">Apply Filters</button></div>'
    };
  });
})();