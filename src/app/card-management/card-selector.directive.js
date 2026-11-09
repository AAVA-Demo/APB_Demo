(function(){
'use strict';
angular.module('creditCardApp').directive('cardSelector',['CardManagementService',function(CardManagementService){
return{restrict:'E',scope:{selectedCard:'=',onSelect:'&'},template:'<div class="form-group"><label>Select Card</label><select class="form-control" ng-model="selectedCard" ng-change="handleChange()"><option value="">All Cards</option><option ng-repeat="card in cards" value="{{card.cardId}}">{{card.cardType}} - ****{{card.cardNumber}}</option></select></div>',link:function(scope,element,attrs){
scope.cards=[];
CardManagementService.getCards([]).then(function(cards){
scope.cards=cards;
});
scope.handleChange=function(){
if(scope.onSelect){
scope.onSelect({cardId:scope.selectedCard});
}
};
}};
}]);