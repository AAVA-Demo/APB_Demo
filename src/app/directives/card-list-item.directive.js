(function(){
'use strict';
angular.module('creditCardApp')
.directive('cardListItem',[function(){
return{
restrict:'E',
scope:{card:'=',onClick:'&'},
template:'<div class="panel" ng-class="getCardClass()"><div class="panel-heading"><h4>{{card.cardType}}</h4><small>****{{card.cardNumber}}</small></div><div class="panel-body"><dl><dt>Credit Limit:</dt><dd>₹{{card.creditLimit|number:2}}</dd><dt>Available:</dt><dd>₹{{card.availableBalance|number:2}}</dd><dt>Outstanding:</dt><dd>₹{{card.outstandingAmount|number:2}}</dd></dl><button class="btn btn-primary btn-block" ng-click="onClick()">View Details</button></div></div>',
link:function(scope,element,attrs){
scope.getCardClass=function(){
var utilization=(scope.card.currentBalance/scope.card.creditLimit)*100;
if(utilization>=70)return'panel-danger';
if(utilization>=30)return'panel-warning';
return'panel-success';
};
}
};
}]);
})();