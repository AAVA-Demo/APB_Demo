(function(){
'use strict';
angular.module('creditCardApp').directive('cardSwitcherDirective',[function(){
return{
restrict:'E',
scope:{cards:'=',selectedCard:'=',onSelect:'&',onToggleComparison:'&',selectedForComparison:'='},
template:'<div><div ng-repeat="card in cards" class="card-item" ng-class="{selected: card.cardId === selectedCard.cardId}" ng-click="selectCard(card)"><div class="row"><div class="col-xs-8"><div class="masked-number" card-mask-directive>{{card.maskedNumber}}</div><div><strong>{{card.cardType}}</strong></div></div><div class="col-xs-4 text-right"><input type="checkbox" ng-click="toggleComparison(card,$event)" ng-checked="isSelected(card.cardId)"><br><small>Compare</small></div></div><div class="row" style="margin-top:10px;"><div class="col-xs-6"><small>Limit: {{card.creditLimit | currency:"₹"}}</small></div><div class="col-xs-6 text-right"><small>Available: {{card.availableCredit | currency:"₹"}}</small></div></div></div></div>',
link:function(scope,element,attrs){
scope.selectCard=function(card){
scope.onSelect({card:card});
};
scope.toggleComparison=function(card,event){
event.stopPropagation();
scope.onToggleComparison({card:card});
};
scope.isSelected=function(cardId){
return scope.selectedForComparison.indexOf(cardId)>-1;
};
}
};
}]);
})();