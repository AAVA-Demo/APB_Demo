(function() {
  'use strict';
  angular.module('cardManagement')
    .directive('cardSwitcher', ['$location', function($location) {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          currentCardId: '='
        },
        template: '<select class="form-control" ng-model="selectedCardId" ng-change="switchCard()"><option ng-repeat="card in cards" value="{{ card.cardId }}">{{ card.cardType }} •••• {{ card.lastFourDigits }}</option></select>',
        link: function(scope) {
          scope.selectedCardId = scope.currentCardId;
          scope.switchCard = function() {
            $location.path('/cards/' + scope.selectedCardId);
          };
        }
      };
    }]);
})();