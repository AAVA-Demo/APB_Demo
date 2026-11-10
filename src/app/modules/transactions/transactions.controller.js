(function(){
'use strict';
angular.module('creditCard.transactions').controller('TransactionController',['TransactionService','CardService','$scope','$timeout',function(TransactionService,CardService,$scope,$timeout){
var vm=this;
vm.transactions=[];
vm.cards=[];
vm.filter={startDate:null,endDate:null,cardIds:[],merchant:'',minAmount:null,maxAmount:null,category:''};
vm.pagination={currentPage:1,pageSize:20,totalRecords:0,sortBy:'date',sortOrder:'desc'};
vm.loading=true;
vm.error=null;
var debounceTimer;
vm.init=function(){
CardService.getUserCards().then(function(cards){
vm.cards=cards;
var thirtyDaysAgo=new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);
vm.filter.startDate=thirtyDaysAgo;
vm.filter.endDate=new Date();
vm.loadTransactions();
}).catch(function(error){
vm.error='Failed to load cards.';
vm.loading=false;
});
};
vm.loadTransactions=function(){
vm.loading=true;
vm.error=null;
TransactionService.getTransactions(vm.filter,vm.pagination).then(function(result){
vm.transactions=result.transactions;
vm.pagination.totalRecords=result.totalCount;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load transactions. Please try again.';
vm.loading=false;
});
};
vm.applyFilter=function(){
vm.pagination.currentPage=1;
vm.loadTransactions();
};
vm.onMerchantSearch=function(){
if(debounceTimer){$timeout.cancel(debounceTimer);}
debounceTimer=$timeout(function(){
vm.applyFilter();
},300);
};
vm.clearFilter=function(){
vm.filter={startDate:null,endDate:null,cardIds:[],merchant:'',minAmount:null,maxAmount:null,category:''};
var thirtyDaysAgo=new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);
vm.filter.startDate=thirtyDaysAgo;
vm.filter.endDate=new Date();
vm.applyFilter();
};
vm.changePage=function(page){
vm.pagination.currentPage=page;
vm.loadTransactions();
};
vm.init();
}]);
})();