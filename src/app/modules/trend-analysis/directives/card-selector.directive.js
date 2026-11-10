(function(){
'use strict';
angular.module('trendAnalysisModule').directive('cardSelector',[function(){
return{
restrict:'E',
scope:{cards:'=',selectedCards:'=',onChange:'&'},
template:'<div class="card-selector"><label>Select Cards:</label><div ng-repeat="card in cards"><label><input type="checkbox" ng-model="cardSelection[card.cardId]" ng-change="onCheckChange()"> {{card.cardType}} - {{card.cardNumber}}</label></div></div>',
link:function(scope,element,attrs){
scope.cardSelection={};
scope.$watch('cards',function(newVal){
if(newVal){
angular.forEach(newVal,function(card){
scope.cardSelection[card.cardId]=true;
});
scope.updateSelectedCards();
}
});
scope.onCheckChange=function(){
scope.updateSelectedCards();
scope.onChange();
};
scope.updateSelectedCards=function(){
var selected=[];
angular.forEach(scope.cardSelection,function(val,key){
if(val){
selected.push(key);
}
});
scope.selectedCards=selected;
};
}
};
}]);
})();