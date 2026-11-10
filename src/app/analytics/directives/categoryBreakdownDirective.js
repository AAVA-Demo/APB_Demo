(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryBreakdown', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="category-breakdown">' +
                '  <h4>Category Breakdown</h4>' +
                '  <div class="table-responsive">' +
                '    <table class="table">' +
                '      <thead>' +
                '        <tr>' +
                '          <th>Category</th>' +
                '          <th>Amount</th>' +
                '          <th>Percentage</th>' +
                '          <th>Transactions</th>' +
                '        </tr>' +
                '      </thead>' +
                '      <tbody>' +
                '        <tr ng-repeat="category in data" class="category-row">' +
                '          <td class="category-name">{{category.categoryName}}</td>' +
                '          <td class="category-amount">{{category.totalAmount | currency}}</td>' +
                '          <td class="category-percent">{{category.percentage | number:1}}%</td>' +
                '          <td>{{category.transactionCount}}</td>' +
                '        </tr>' +
                '      </tbody>' +
                '    </table>' +
                '  </div>' +
                '</div>'
    };
  }]);
})();