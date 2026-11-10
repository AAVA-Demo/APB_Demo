(function(){
'use strict';
angular.module('transactionsModule').controller('TransactionListController',['$scope','TransactionService','CardMetadataService','AuthService',function($scope,TransactionService,CardMetadataService,AuthService){
var vm=this;
vm.transactions=[];
vm.cardList=[];
vm.totalTransactions=0;
vm.currentPage=1;
vm.pageSize=50;
vm.loading=true;
vm.error=null;
vm.filterCriteria={dateFrom:null,dateTo:null,cardIds:[],minAmount:null,maxAmount:null};
function init(){
var userId=AuthService.getUserId();
if(!userId){
vm.error='User not authenticated';
vm.loading=false;
return;
}
CardMetadataService.fetchCardList(userId).then(function(cards){
vm.cardList=cards;
return loadTransactions();
}).catch(function(error){
vm.error='Failed to load transactions';
vm.loading=false;
});
}
function loadTransactions(){
var params={page:vm.currentPage,size:vm.pageSize};
if(vm.filterCriteria.dateFrom)params.dateFrom=vm.filterCriteria.dateFrom;
if(vm.filterCriteria.dateTo)params.dateTo=vm.filterCriteria.dateTo;
if(vm.filterCriteria.cardIds.length>0)params.cardId=vm.filterCriteria.cardIds.join(',');
if(vm.filterCriteria.minAmount)params.minAmount=vm.filterCriteria.minAmount;
if(vm.filterCriteria.maxAmount)params.maxAmount=vm.filterCriteria.maxAmount;
TransactionService.getTransactions(params).then(function(data){
vm.transactions=data.transactions||[];
vm.totalTransactions=data.total||0;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load transactions';
vm.loading=false;
});
}
vm.applyFilter=function(criteria){
vm.filterCriteria=criteria;
vm.currentPage=1;
vm.loading=true;
loadTransactions();
};
vm.nextPage=function(){
if(vm.currentPage*vm.pageSize<vm.totalTransactions){
vm.currentPage++;
vm.loading=true;
loadTransactions();
}
};
vm.prevPage=function(){
if(vm.currentPage>1){
vm.currentPage--;
vm.loading=true;
loadTransactions();
}
};
$scope.$on('filterApplied',function(event,criteria){
vm.applyFilter(criteria);
});
init();
}]);
})();