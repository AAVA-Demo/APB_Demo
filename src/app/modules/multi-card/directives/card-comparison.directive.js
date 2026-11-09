(function() {
  'use strict';
  angular.module('multiCardManagement').directive('cardComparison', ['$filter', function($filter) {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div class="chart-container"><h4>Card Comparison</h4><table class="comparison-table"><thead><tr><th>Attribute</th><th ng-repeat="card in cards">{{card.cardNumber}}</th></tr></thead><tbody><tr><td><strong>Card Type</strong></td><td ng-repeat="card in cards">{{card.cardType}}</td></tr><tr><td><strong>Issuer</strong></td><td ng-repeat="card in cards">{{card.issuer}}</td></tr><tr><td><strong>Credit Limit</strong></td><td ng-repeat="card in cards">{{card.creditLimit | currency}}</td></tr><tr><td><strong>Available Credit</strong></td><td ng-repeat="card in cards">{{card.availableCredit | currency}}</td></tr><tr><td><strong>Current Balance</strong></td><td ng-repeat="card in cards">{{card.currentBalance | currency}}</td></tr><tr><td><strong>Status</strong></td><td ng-repeat="card in cards">{{card.status}}</td></tr></tbody></table></div>',
      link: function(scope, element, attrs) {}
    };
  }]);
})();