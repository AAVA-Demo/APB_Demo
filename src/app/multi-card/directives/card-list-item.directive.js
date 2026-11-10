(function(){
'use strict';
angular.module('app.creditCard.multiCard').directive('cardListItem',cardListItem);
function cardListItem(){
return{
restrict:'E',
scope:{card:'=',selected:'=',onSelect:'&'},
template:'<a href="" class="list-group-item" ng-class="{active:card.cardId===selected.cardId}" ng-click="selectCard()"><h4 class="list-group-item-heading">{{card.cardName}}</h4><p class="list-group-item-text">{{card.cardNumber}} - {{card.cardType}}</p><p class="list-group-item-text"><strong>Balance:</strong> ${{card.outstandingAmount | number:2}}</p></a>',
link:function(scope){
scope.selectCard=function(){
scope.onSelect();
};
}
};
}
})();