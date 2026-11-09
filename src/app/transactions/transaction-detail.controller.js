(function(){
'use strict';
angular.module('app.transactions').controller('TransactionDetailController',['$scope','$routeParams','TransactionService',function($scope,$routeParams,TransactionService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.transaction=null;
vm.loadTransactionDetail=function(){
const transactionId=$routeParams.id;
vm.loading=true;
TransactionService.getTransactionById(transactionId).then(function(data){
vm.transaction=data;
vm.loading=false;
},function(error){
vm.error='Failed to load transaction details.';
const mockTransactions=TransactionService.getMockTransactions();
vm.transaction=mockTransactions.find(function(t){return t.transactionId===transactionId;})||mockTransactions[0];
vm.loading=false;
});
};
vm.loadTransactionDetail();
}]);
})();