(function(){
'use strict';
angular.module('creditCard.transactions').controller('TransactionDetailController',['$routeParams','TransactionService',function($routeParams,TransactionService){
var vm=this;
vm.transaction=null;
vm.loading=false;
vm.error=null;
vm.loadTransaction=function(){
vm.loading=true;
vm.error=null;
TransactionService.getTransactionById($routeParams.transactionId).then(function(data){
vm.transaction=data;
vm.loading=false;
},function(err){
vm.error='Failed to load transaction details.';
vm.loading=false;
});
};
vm.loadTransaction();
}]);
})();