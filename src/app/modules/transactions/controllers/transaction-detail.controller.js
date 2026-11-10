(function(){
'use strict';
angular.module('transactionModule').controller('TransactionDetailController',['TransactionService','AuthService','$scope','$routeParams','NotificationService',function(TransactionService,AuthService,$scope,$routeParams,NotificationService){
var vm=this;
vm.transaction=null;
vm.loading=true;
var userContext=AuthService.getUserContext();
var transactionId=$routeParams.transactionId;
TransactionService.getTransactionDetail(transactionId,userContext.userId).then(function(transaction){
vm.transaction=transaction;
$scope.$apply();
vm.loading=false;
},function(error){
NotificationService.error('Transaction not found');
vm.loading=false;
});
vm.goBack=function(){
window.history.back();
};
}]);
})();