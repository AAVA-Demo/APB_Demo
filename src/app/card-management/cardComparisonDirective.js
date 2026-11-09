(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardComparison', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div class="panel panel-default"><div class="panel-heading"><h4>Card Comparison</h4></div><div class="panel-body"><div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th ng-click="sortBy(\'rank\')">Rank</th><th ng-click="sortBy(\'cardNumber\')">Card Number</th><th ng-click="sortBy(\'cardType\')">Type</th><th ng-click="sortBy(\'monthlySpend\')">Monthly Spend</th><th ng-click="sortBy(\'utilizationPercent\')">Utilization %</th><th ng-click="sortBy(\'availableCredit\')">Available Credit</th></tr></thead><tbody><tr ng-repeat="card in cards | orderBy:sortField:sortReverse"><td>{{card.rank}}</td><td>{{card.cardNumber}}</td><td>{{card.cardType}}</td><td>${{card.monthlySpend | number:2}}</td><td>{{card.utilizationPercent}}%</td><td>${{card.availableCredit | number:2}}</td></tr></tbody></table></div></div></div>',
      link: function(scope) {
        scope.sortField = 'rank';
        scope.sortReverse = false;
        scope.sortBy = function(field) {
          if (scope.sortField === field) {
            scope.sortReverse = !scope.sortReverse;
          } else {
            scope.sortField = field;
            scope.sortReverse = false;
          }
        };
      }
    };
  }]);
})();