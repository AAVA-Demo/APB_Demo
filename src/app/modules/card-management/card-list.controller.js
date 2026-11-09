(function(){
'use strict';
angular.module('app.cardManagement').controller('CardListController',CardListController);
CardListController.$inject=['CardService','$scope','$location'];
function CardListController(CardService,$scope,$location){
var vm=this;
vm.cards=[];
vm.loading=true;
vm.error=null;
vm.selectCard=selectCard;
function init(){
CardService.getCards().then(function(data){
vm.cards=data;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load cards. Please try again.';
vm.loading=false;
});
}
function selectCard(cardId){
$location.path('/cards/'+cardId);
}
init();
}
})();