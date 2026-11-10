(function(){
'use strict';
angular.module('cardManagementModule').controller('CardManagementController',['CardManagementService','TransactionFactory','$scope','$routeParams','$location',function(CardManagementService,TransactionFactory,$scope,$routeParams,$location){
const vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.transactions=[];
vm.spendAnalysis=null;
vm.loading=true;
vm.currentPage=1;
vm.pageSize=50;
vm.hasMore=true;
if($routeParams.cardId){
vm.loadCardDetails($routeParams.cardId);
}else{
vm.loadAllCards();
}
vm.loadAllCards=function(){
vm.loading=true;
CardManagementService.getAllCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
}).catch(function(err){
vm.loading=false;
vm.error='Failed to load cards';
});
};
vm.loadCardDetails=function(cardId){
vm.loading=true;
CardManagementService.getCardDetails(cardId).then(function(card){
vm.selectedCard=card;
return vm.loadTransactions(cardId,1);
}).then(function(){
vm.loading=false;
}).catch(function(err){
vm.loading=false;
vm.error='Failed to load card details';
});
};
vm.loadTransactions=function(cardId,page){
return TransactionFactory.getTransactions(cardId,page,vm.pageSize).then(function(txns){
if(page===1){
vm.transactions=txns;
}else{
vm.transactions=vm.transactions.concat(txns);
}
vm.hasMore=txns.length===vm.pageSize;
vm.spendAnalysis=CardManagementService.computeSpendAnalysis(vm.transactions);
return txns;
});
};
vm.loadMoreTransactions=function(){
if(vm.hasMore&&!vm.loading){
vm.currentPage++;
vm.loadTransactions(vm.selectedCard.id,vm.currentPage);
}
};
vm.selectCard=function(card){
$location.path('/cards/'+card.id);
};
vm.backToList=function(){
$location.path('/cards');
};
vm.formatCurrency=function(amount){
return '₹'+amount.toLocaleString('en-IN');
};
}]);
})();