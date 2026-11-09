(function(){
'use strict';
angular.module('cardManagementModule').directive('cardItem',function(){
return{restrict:'E',scope:{card:'=',onSelect:'&'},template:'<div class="card-item panel panel-default" ng-click="selectCard()"><div class="panel-heading"><strong>{{card.cardType}}</strong></div><div class="panel-body"><p>****{{card.cardNumber.slice(-4)}}</p><p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p><p><strong>Outstanding:</strong> ${{card.outstandingBalance | number:2}}</p><p><strong>Available:</strong> ${{card.availableCredit | number:2}}</p></div></div>',link:function(scope){
scope.selectCard=function(){
scope.onSelect();
};
}};
});
})();