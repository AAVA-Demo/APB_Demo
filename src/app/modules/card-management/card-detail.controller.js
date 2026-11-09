(function(){
'use strict';
angular.module('app.cardManagement').controller('CardDetailController',['$scope','$routeParams','CardService','TransactionService',function($scope,$routeParams,CardService,TransactionService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.card=null;
vm.transactions=[];
vm.pagination={currentPage:1,totalPages:1,pageSize:50,totalCount:0};
vm.loadPage=loadPage;
function init(){
const cardId=$routeParams.cardId;
vm.loading=true;
vm.error=null;
CardService.getCardDetails(cardId).then(function(card){
vm.card=card;
return TransactionService.getTransactions(cardId,1,50);
}).then(function(result){
vm.transactions=result.transactions;
vm.pagination={
currentPage:result.currentPage,
totalPages:result.totalPages,
pageSize:result.pageSize,
totalCount:result.totalCount
};
vm.loading=false;
}).catch(function(error){
vm.error=error.message||'Failed to load card details';
vm.loading=false;
});
}
function loadPage(page){
if(page<1||page>vm.pagination.totalPages)return;
const cardId=$routeParams.cardId;
TransactionService.getTransactions(cardId,page,vm.pagination.pageSize).then(function(result){
vm.transactions=result.transactions;
vm.pagination.currentPage=result.currentPage;
});
}
init();
}]);
})();