(function(){
'use strict';
angular.module('portfolioModule').directive('cardList',['$compile',function($compile){
return{
restrict:'E',
scope:{cards:'=',onSelect:'&'},
template:'<div class="row"><div class="col-md-4 col-sm-6 col-xs-12" ng-repeat="card in cards track by card.cardId"><div class="card-item" ng-click="selectCard(card)"><h4>{{card.cardType}}</h4><p>{{card.cardNumber}}</p><p>Limit: {{card.creditLimit|currency}}</p><p>Balance: {{card.currentBalance|currency}}</p><p>Available: {{card.availableCredit|currency}}</p><p ng-if="card.metrics">Utilization: {{card.metrics.utilizationRate}}%</p></div></div></div>',
link:function(scope,element,attrs){
scope.selectCard=function(card){
scope.onSelect({card:card});
};
}
};
}]);
})();