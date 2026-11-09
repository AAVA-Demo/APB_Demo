(function(){
'use strict';
angular.module('transactionModule').controller('transactionDetailController',['transactionService','$routeParams',function(transactionService,$routeParams){
var vm=this;
vm.transaction=null;
vm.loading=true;
vm.error=null;
function init(){
var transactionId=$routeParams.transactionId;
transactionService.getTransactionById(transactionId).then(function(transaction){
vm.transaction=transaction;
vm.loading=false;
},function(error){
vm.error='Failed to load transaction details';
vm.loading=false;
});
}
init();
}]);
})();