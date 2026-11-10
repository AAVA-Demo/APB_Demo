(function() {
'use strict';
angular.module('app.cardManagement')
.directive('cardItem', [function() {
return {
restrict: 'E',
scope: {
card: '=',
onSelect: '&'
},
template: '<div class="panel panel-default card-item" ng-click="selectCard()"><div class="panel-body"><h4>{{card.cardType}}</h4><p>{{card.cardNumber}}</p><p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p><p><strong>Available:</strong> {{card.availableCredit | currency}}</p><div class="progress"><div class="progress-bar" ng-class="{\'progress-bar-danger\': card.utilizationPercentage > 80, \'progress-bar-warning\': card.utilizationPercentage > 50 && card.utilizationPercentage <= 80}" role="progressbar" ng-style="{\'width\': card.utilizationPercentage + \'%\'}">{{card.utilizationPercentage}}%</div></div></div></div>',
link: function(scope, element, attrs) {
scope.selectCard = function() {
scope.onSelect();
};
}
};
}]);
})();