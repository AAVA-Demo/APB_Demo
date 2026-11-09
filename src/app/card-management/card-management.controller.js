(function(){
'use strict';
angular.module('creditCardApp.cardManagement').controller('CardManagementController',['CreditCardDataService','TransactionService','CardComparisonService','AuthService','$scope',function(CreditCardDataService,TransactionService,CardComparisonService,AuthService,$scope){
var vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.cardSpending=null;
vm.comparisonMode=false;
vm.selectedForComparison=[];
vm.comparisonResults=[];
vm.loading=true;
vm.selectCard=selectCard;
vm.toggleComparison=toggleComparison;
vm.compareSelected=compareSelected;
vm.init=init;
function init(){
var userId=AuthService.getUserId();
loadCards(userId);
}
function loadCards(userId){
vm.loading=true;
CreditCardDataService.getAllCards(userId).then(function(cards){
vm.cards=cards;
if(cards.length>0){
selectCard(cards[0]);
}
vm.loading=false;
},function(error){
toastr.error('Failed to load cards');
vm.loading=false;
});
}
function selectCard(card){
vm.selectedCard=card;
TransactionService.getCardSpending(card.cardId).then(function(spending){
vm.cardSpending=spending;
},function(error){
toastr.error('Failed to load card spending');
});
}
function toggleComparison(card){
var idx=vm.selectedForComparison.indexOf(card.cardId);
if(idx>-1){
vm.selectedForComparison.splice(idx,1);
}else{
vm.selectedForComparison.push(card.cardId);
}
}
function compareSelected(){
if(vm.selectedForComparison.length<2){
toastr.warning('Please select at least 2 cards to compare');
return;
}
CardComparisonService.compareCards(vm.selectedForComparison).then(function(results){
vm.comparisonResults=results;
vm.comparisonMode=true;
},function(error){
toastr.error('Failed to compare cards');
});
}
vm.init();
}]);
})();