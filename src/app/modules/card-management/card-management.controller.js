(function(){
'use strict';
angular.module('cardManagementModule').controller('CardManagementController',['CardManagementService','$scope','$state','$stateParams',function(CardManagementService,$scope,$state,$stateParams){
var vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.loading=true;
vm.error=null;
if($state.current.name==='cards'){
CardManagementService.getUserCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
},function(error){
vm.error='Failed to load cards';
vm.loading=false;
});
}else if($state.current.name==='cardDetail'){
var cardId=$stateParams.cardId;
CardManagementService.getCardDetail(cardId).then(function(card){
vm.selectedCard=card;
vm.loading=false;
},function(error){
vm.error='Failed to load card details';
vm.loading=false;
});
}
vm.selectCard=function(cardId){
$state.go('cardDetail',{cardId:cardId});
};
}]);
})();