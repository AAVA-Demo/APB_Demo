(function(){
'use strict';
angular.module('cardManagementModule').controller('CardManagementController',['$scope','CardManagementService','TransactionService',function($scope,CardManagementService,TransactionService){
var vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.transactions=[];
vm.loading=true;
vm.error=null;
vm.transactionLoading=false;
vm.transactionError=null;
vm.init=function(){
CardManagementService.getAllCards().then(function(data){
vm.cards=data;
vm.loading=false;
},function(error){
vm.error='Failed to load card data. Please try again.';
vm.loading=false;
});
};
vm.onCardSelect=function(card){
vm.selectedCard=card;
vm.transactionLoading=true;
vm.transactionError=null;
TransactionService.getTransactionsByCard(card.cardId).then(function(data){
vm.transactions=data;
vm.transactionLoading=false;
},function(error){
vm.transactionError='Failed to load transactions. Please try again.';
vm.transactionLoading=false;
});
};
vm.init();
}]);
})();