(function(){
'use strict';
angular.module('cardManagementModule').directive('cardSummary',[function(){
return{
restrict:'E',
scope:{card:'=',onSelect:'&'},
template:'<div class="card-summary" ng-click="selectCard()">'+
'<h4>{{card.cardType}} - {{card.cardNumber}}</h4>'+
'<p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p>'+
'<p><strong>Available:</strong> ${{card.availableCredit | number:2}}</p>'+
'<p><strong>Outstanding:</strong> ${{card.outstandingAmount | number:2}}</p>'+
'<p><strong>Monthly Spend:</strong> ${{card.monthlySpend | number:2}}</p>'+
'</div>',
link:function(scope){
scope.selectCard=function(){
if(scope.onSelect){
scope.onSelect({cardId:scope.card.cardId});
}
};
}
};
}]);
})();