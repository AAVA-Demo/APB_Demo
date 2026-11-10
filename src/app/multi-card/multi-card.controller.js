(function(){
'use strict';
angular.module('app.creditCard.multiCard').controller('MultiCardController',MultiCardController);
MultiCardController.$inject=['CardManagementService','$scope','$filter'];
function MultiCardController(CardManagementService,$scope,$filter){
var vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.loading=true;
vm.error=null;
vm.selectCard=selectCard;
var userId='user123';
init();
function init(){
loadCards();}
function loadCards(){
vm.loading=true;
vm.error=null;
CardManagementService.getUserCards(userId).then(function(cards){
vm.cards=cards;
vm.loading=false;
if(cards.length>0){vm.selectedCard=cards[0];}
}).catch(function(error){
vm.error='Failed to load credit cards';
vm.loading=false;
});}
function selectCard(card){
vm.selectedCard=card;}
}
})();