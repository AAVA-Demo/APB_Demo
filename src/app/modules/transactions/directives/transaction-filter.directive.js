(function() {
  'use strict';
  angular.module('creditcard.transactions')
    .directive('ccTransactionFilter', [ccTransactionFilter]);
  function ccTransactionFilter() {
    return {
      restrict: 'E',
      scope: {
        filter: '=',
        cards: '=',
        onApply: '&',
        onClear: '&'
      },
      template: '<div class="filter-panel panel panel-default">' +
                '  <div class="panel-heading">Filter Transactions</div>' +
                '  <div class="panel-body">' +
                '    <div class="row">' +
                '      <div class="col-md-3">' +
                '        <label>Card</label>' +
                '        <select class="form-control" ng-model="filter.cardId">' +
                '          <option value="">All Cards</option>' +
                '          <option ng-repeat="card in cards" value="{{card}}">{{card}}</option>' +
                '        </select>' +
                '      </div>' +
                '      <div class="col-md-3">' +
                '        <label>Category</label>' +
                '        <select class="form-control" ng-model="filter.category">' +
                '          <option value="">All Categories</option>' +
                '          <option value="Food & Dining">Food & Dining</option>' +
                '          <option value="Fuel">Fuel</option>' +
                '          <option value="Shopping">Shopping</option>' +
                '          <option value="Travel">Travel</option>' +
                '          <option value="Entertainment">Entertainment</option>' +
                '          <option value="Utilities">Utilities</option>' +
                '          <option value="Healthcare">Healthcare</option>' +
                '          <option value="Education">Education</option>' +
                '          <option value="Miscellaneous">Miscellaneous</option>' +
                '        </select>' +
                '      </div>' +
                '      <div class="col-md-2">' +
                '        <label>Start Date</label>' +
                '        <input type="date" class="form-control" ng-model="filter.startDate">' +
                '      </div>' +
                '      <div class="col-md-2">' +
                '        <label>End Date</label>' +
                '        <input type="date" class="form-control" ng-model="filter.endDate">' +
                '      </div>' +
                '      <div class="col-md-2">' +
                '        <label>&nbsp;</label>' +
                '        <div>' +
                '          <button class="btn btn-primary" ng-click="onApply()">Apply</button>' +
                '          <button class="btn btn-default" ng-click="onClear()">Clear</button>' +
                '        </div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }
})();