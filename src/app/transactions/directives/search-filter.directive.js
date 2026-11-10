(function() {
  'use strict';
  angular.module('transactionModule').directive('searchFilter', [function() {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        onSearchChange: '&',
        onFilterChange: '&'
      },
      template: '<div class="filter-panel">' +
        '<div class="row">' +
        '<div class="col-md-4">' +
        '<input type="text" class="form-control" placeholder="Search merchant..." ng-model="filters.searchTerm" ng-change="onSearchChange()">' +
        '</div>' +
        '<div class="col-md-4">' +
        '<select class="form-control" ng-model="filters.cardId" ng-change="onFilterChange()">' +
        '<option value="">All Cards</option>' +
        '<option value="1">Visa Platinum</option>' +
        '<option value="2">MasterCard Gold</option>' +
        '<option value="3">Amex Blue</option>' +
        '</select>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<select class="form-control" ng-model="filters.dateRange" ng-change="onFilterChange()">' +
        '<option value="">All Time</option>' +
        '<option value="7">Last 7 Days</option>' +
        '<option value="30">Last 30 Days</option>' +
        '<option value="90">Last 90 Days</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>'
    };
  }]);
})();