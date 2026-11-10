(function(){
'use strict';
angular.module('analyticsModule').directive('cardBreakdown',[function(){
return{
restrict:'E',scope:{data:'='},template:'<div class="card-breakdown"><table><thead><tr><th>Card Name</th><th>Total Spend</th></tr></thead><tbody><tr ng-repeat="card in data track by card.cardId"><td>{{card.cardName}}</td><td>{{card.totalSpend|currency}}</td></tr></tbody></table></div>'
};
}]);
})();