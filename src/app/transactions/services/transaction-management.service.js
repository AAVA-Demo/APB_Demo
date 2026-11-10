(function(){
'use strict';
angular.module('transactionModule').service('TransactionManagementService',['TransactionDataService','CreditCardService','SearchFilterFactory','$q',function(TransactionDataService,CreditCardService,SearchFilterFactory,$q){
var vm=this;
vm.getTransactions=function(page,pageSize){
return TransactionDataService.fetchTransactions(page,pageSize);
};
vm.getFilteredTransactions=function(criteria,page,pageSize){
var query=SearchFilterFactory.buildFilterQuery(criteria);
return TransactionDataService.fetchTransactions(page,pageSize,query);
};
vm.getCardFilterParams=function(cardId){
return CreditCardService.getCardFilterParams(cardId);
};
}]);
})();