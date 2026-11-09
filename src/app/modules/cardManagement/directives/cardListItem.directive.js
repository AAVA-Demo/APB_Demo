(function() {
  'use strict';
  angular.module('creditCardManagement')
    .directive('cardListItem', [cardListItem]);
  function cardListItem() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&'
      },
      template: '<div class="card-list-item" ng-click="selectCard()">' +
                '  <div class="card-header">' +
                '    <h4>{{card.cardType}} - {{card.cardNumber}}</h4>' +
                '  </div>' +
                '  <div class="card-body">' +
                '    <div class="row">' +
                '      <div class="col-xs-4">' +
                '        <p class="label-text">Credit Limit</p>' +
                '        <p class="value-text">${{card.creditLimit | number:2}}</p>' +
                '      </div>' +
                '      <div class="col-xs-4">' +
                '        <p class="label-text">Available</p>' +
                '        <p class="value-text text-success">${{card.availableCredit | number:2}}</p>' +
                '      </div>' +
                '      <div class="col-xs-4">' +
                '        <p class="label-text">Outstanding</p>' +
                '        <p class="value-text text-danger">${{card.outstandingAmount | number:2}}</p>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <div class="card-footer">' +
                '    <span class="glyphicon glyphicon-chevron-right pull-right"></span>' +
                '  </div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.selectCard = function() {
          if (scope.onSelect) {
            scope.onSelect({cardId: scope.card.cardId});
          }
        };
      }
    };
  }
})();