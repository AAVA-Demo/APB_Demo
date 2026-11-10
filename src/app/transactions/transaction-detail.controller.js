(function(){
'use strict';
angular.module('app.transactions').controller('TransactionDetailController',['$stateParams','TransactionService',function($stateParams,TransactionService){
const vm=this;
vm.transaction=null;
vm.loading=true;
vm.error=null;
vm.init=function(){
const transactionId=$stateParams.id;
TransactionService.getTransactionById(transactionId).then(function(data){
vm.transaction=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load transaction details';
vm.loading=false;
});
};
vm.init();
}]);
})();