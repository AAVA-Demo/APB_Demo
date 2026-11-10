(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardList', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&'
        },
        template: '<div class="col-md-4 col-sm-6 col-xs-12" ng-repeat="card in cards track by card.cardId">' +
                  '<div class="card-item" ng-click="selectCard(card)">' +
                  '<div class="card-number">{{ card.cardNumber }}</div>' +
                  '<div class="card-bank">{{ card.bankName }}</div>' +
                  '<div class="card-balance">{{ formatCurrency(card.balance) }}</div>' +
                  '<div class="card-limit">Limit: {{ formatCurrency(card.creditLimit) }}</div>' +
                  '<div class="utilization-bar">' +
                  '<div class="utilization-fill" ng-style="{width: card.utilizationRate + "%"}"></div>' +
                  '</div>' +
                  '<div style="margin-top:5px;"><small>Utilization: {{ card.utilizationRate }}%</small></div>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.selectCard = function(card) {
            scope.onSelect({ card: card });
          };
          scope.formatCurrency = function(value) {
            return '$' + (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          };
        }
      };
    }]);
})();