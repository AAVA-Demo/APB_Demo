(function(){
'use strict';
angular.module('dashboardModule').directive('cardList',[function(){
return{
restrict:'E',scope:{cards:'='},template:'<div class="card-list"><div class="card-item" ng-repeat="card in cards track by card.cardId"><div class="card-name">{{card.cardName}}</div><div class="card-type">{{card.cardType}}</div><div class="card-details"><span>Balance: {{card.balance|currency}}</span><span>Limit: {{card.creditLimit|currency}}</span><span>Available: {{card.availableCredit|currency}}</span></div></div></div>'
};
}]);
})();